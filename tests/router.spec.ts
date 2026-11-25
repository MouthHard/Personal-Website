/**
 * 路由模块测试
 * @description 校验路由结构的关键不变量（存在性 / 懒加载 / 唯一性 / 跳转目标有效）。
 * 刻意不锁定「子路由数量」这类会随页面增删变化的具体数值，
 * 否则每次加一个页面测试就会失败，失去回归价值。
 */

import { describe, it, expect } from 'vitest';
import type { RouteRecordRaw } from 'vue-router';
import {
  aphorismRoutes,
  museumRoutes,
  gameRoutes,
  musicRoutes,
  otherRoutes,
} from '@/router/modules';

const allRoutes: RouteRecordRaw[] = [
  ...aphorismRoutes,
  ...museumRoutes,
  ...gameRoutes,
  ...musicRoutes,
  ...otherRoutes,
];

/** 取某个路由的子路由 path 列表 */
const childPaths = (route: RouteRecordRaw | undefined): string[] =>
  (route?.children ?? []).map((child) => child.path);

/** 取某个路由的子路由 name 列表 */
const childNames = (route: RouteRecordRaw | undefined): string[] =>
  (route?.children ?? []).map((child) => String(child.name ?? ''));

describe('路由模块配置', () => {
  describe('顶层路由', () => {
    it('每个子应用都应有顶层路由，且组件为懒加载函数', () => {
      expect(allRoutes.length).toBeGreaterThan(0);

      allRoutes.forEach((route) => {
        expect(typeof route.path).toBe('string');
        expect(route.path.startsWith('/')).toBe(true);
        expect(route.name).toBeTruthy();
        expect(route.component).toBeInstanceOf(Function);
      });
    });

    it('重定向目标必须指向自身已存在的子路由', () => {
      allRoutes
        .filter((route) => typeof route.redirect === 'string')
        .forEach((route) => {
          const redirect = String(route.redirect);
          const target = redirect.slice(route.path.length + 1).split('/')[0];
          expect(childPaths(route)).toContain(target);
        });
    });
  });

  describe('aphorismRoutes - 格言路由', () => {
    it('应该包含正确的路径与名称', () => {
      expect(aphorismRoutes[0].path).toBe('/aphorism');
      expect(aphorismRoutes[0].name).toBe('aphorism');
    });
  });

  describe('museumRoutes - 博物馆路由', () => {
    it('应该包含详情子路由且带动态参数', () => {
      const museumRoute = museumRoutes[0];
      expect(museumRoute.path).toBe('/museum');

      const detail = museumRoute.children?.find(
        (r) => r.name === 'museum-detail',
      );
      expect(detail?.path).toBe(':province/:id');
    });
  });

  describe('gameRoutes - 游戏路由', () => {
    it('应该包含核心页面子路由', () => {
      const gameRoute = gameRoutes[0];
      expect(gameRoute.path).toBe('/game');

      expect(childPaths(gameRoute)).toEqual(
        expect.arrayContaining(['store', 'sale', 'ranking', 'library']),
      );
    });
  });

  describe('musicRoutes - 音乐路由', () => {
    it('应该包含核心页面子路由', () => {
      const musicRoute = musicRoutes[0];
      expect(musicRoute.path).toBe('/music');

      expect(childPaths(musicRoute)).toEqual(
        expect.arrayContaining(['discover', 'category', 'search', 'mine']),
      );
    });

    it('「我的音乐」应该有下级子路由', () => {
      const mineRoute = musicRoutes[0].children?.find(
        (r) => r.name === 'music-mine',
      );
      expect(childPaths(mineRoute).length).toBeGreaterThan(0);
    });
  });

  describe('otherRoutes - 其他路由', () => {
    it('旅行攻略应该包含美食与风景子路由', () => {
      const travelRoute = otherRoutes.find((r) => r.name === 'travel-guide');
      expect(travelRoute?.path).toBe('/travel-guide');
      expect(childNames(travelRoute)).toEqual(
        expect.arrayContaining(['food', 'scenery']),
      );
    });

    it('应该包含历史路由', () => {
      const historyRoute = otherRoutes.find((r) => r.name === 'history');
      expect(historyRoute?.path).toBe('/history');
    });
  });

  describe('路由模块整合', () => {
    it('所有路由路径应该唯一', () => {
      const allPaths = allRoutes.map((r) => r.path);
      expect(new Set(allPaths).size).toBe(allPaths.length);
    });

    it('所有路由名称应该唯一', () => {
      const allNames = allRoutes.map((r) => r.name).filter(Boolean);
      expect(new Set(allNames).size).toBe(allNames.length);
    });
  });
});
