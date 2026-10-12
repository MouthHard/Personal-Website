<template>
  <div class="discover-theme">
    <section class="theme-album">
      <!-- 黄铜护角 -->
      <span class="brass-corner brass-corner--tl"></span>
      <span class="brass-corner brass-corner--tr"></span>
      <span class="brass-corner brass-corner--bl"></span>
      <span class="brass-corner brass-corner--br"></span>

      <div class="album-layout">
        <!-- 左：皮革书签索引 -->
        <aside class="bookmark-index">
          <div class="bookmark-caption">
            <span class="bc-glyph"><LayersIcon :size="28" /></span>
            <span class="bc-text">分类</span>
          </div>
          <button
            v-for="g in themeGroups"
            :key="g.key"
            class="bookmark-tab"
            :class="{ active: activeGroup === g.key, 'bm-play': g.key === 'play' }"
            @click="activeGroup = g.key"
          >
            <span class="bm-fold"></span>
            <span class="bm-stamp"></span>
            <span class="bm-icon"><component :is="groupIcon(g.key)" :size="20" /></span>
            <span class="bm-info">
              <span class="bm-text">{{ g.title }}</span>
              <span class="bm-count">{{ g.items.length }}</span>
            </span>
          </button>
        </aside>

        <!-- 中：明信片收藏格 -->
        <div class="postcard-grid">
          <div class="grid-caption">
            <span class="gc-bar"></span>
            <span class="gc-text">{{ currentGroup.title }}</span>
            <span class="gc-count">{{ currentGroup.items.length }}张</span>
          </div>
          <div class="grid-slots">
            <button
              v-for="(theme, ti) in currentGroup.items"
              :key="theme.key"
              class="postcard-slot"
              :class="{ active: currentThemeKey === theme.key, tilt: ti % 2 === 1 }"
              @click="selectTheme(theme.key)"
            >
              <span class="ps-corner ps-corner--tl"></span>

              <span class="ps-corner ps-corner--bl"></span>
              <span class="ps-corner ps-corner--br"></span>
              <span class="ps-active-ring"></span>
              <span class="ps-postmark">
                <span class="pm-ring"></span>
                <span class="pm-num">{{ theme.avgRating.toFixed(1) }}</span>
              </span>
              <span class="ps-stamp"><component :is="theme.icon" :size="24" /></span>
              <span class="ps-caption">{{ theme.name }}</span>
              <span class="ps-tags">
                <span class="ps-tag ps-tag--spots">{{ theme.spots.length }}处</span>
                <span class="ps-tag ps-tag--season">{{ theme.bestSeason }}</span>
              </span>
            </button>
          </div>
        </div>

        <!-- 右：放大展示页 -->
        <div class="display-page" v-if="currentTheme">
          <div class="postcard-hero">
          <!-- 大明信片 -->
          <div class="page-postcard">
            <img
              v-if="currentTheme.coverImage"
              :src="currentTheme.coverImage"
              :alt="currentTheme.name"
              class="pc-img"
            />
            <div class="pc-vignette"></div>
            <span class="pc-corner pc-corner--tl"></span>
            <span class="pc-corner pc-corner--tr"></span>
            <span class="pc-corner pc-corner--bl"></span>
            <span class="pc-corner pc-corner--br"></span>
            <div class="pc-postmark">
              <span class="ppm-ring"></span>
              <span class="ppm-date">{{ currentTheme.bestSeason }}</span>
            </div>
            <div class="pc-stamp">
              <component :is="currentTheme.icon" :size="30" />
            </div>
            <div class="pc-titlebox">
              <span class="pc-name">{{ currentTheme.name }}</span>
              <span class="pc-rating"><StarIcon :size="17" /> {{ currentTheme.avgRating.toFixed(1) }}</span>
            </div>
          </div>

          <!-- 邮戳信息章 -->
          <div class="info-stamps">
            <div class="info-stamp is-days">
              <span class="is-grommet"></span>
              <span class="is-ico"><CalendarIcon :size="18" /></span>
              <span class="is-label">推荐</span>
              <span class="is-val">{{ currentTheme.recommendedDays }}</span>
            </div>
            <div class="info-stamp is-budget">
              <span class="is-grommet"></span>
              <span class="is-ico"><ShoppingBagIcon :size="18" /></span>
              <span class="is-label">预算</span>
              <span class="is-val">{{ currentTheme.budget }}</span>
            </div>
            <div class="info-stamp is-intensity">
              <span class="is-grommet"></span>
              <span class="is-ico"><EnergyIcon :size="18" /></span>
              <span class="is-label">体力</span>
              <span class="is-val">{{ currentTheme.intensity }}</span>
            </div>
            <div class="info-stamp is-audience">
              <span class="is-grommet"></span>
              <span class="is-ico"><UsersIcon :size="18" /></span>
              <span class="is-label">适合</span>
              <span class="is-val">{{ currentTheme.audience }}</span>
            </div>
          </div>
          </div>

          <!-- 亮点行李牌 -->
          <div class="highlight-tags" v-if="currentTheme.highlights.length">
            <span class="ht-label"><SparklesIcon :size="20" /> 亮点体验</span>
            <div class="ht-list">
              <span
                v-for="h in currentTheme.highlights"
                :key="h"
                class="ht-tag"
              >{{ h }}</span>
            </div>
          </div>

          <!-- 景点明信片集 -->
          <div class="spot-postcards">
            <span class="sp-label"><MapIcon :size="20" /> 关联景点<span class="sp-count">{{ currentTheme.spots.length }}处</span></span>
            <div class="sp-list">
              <div
                v-for="(spot, idx) in currentTheme.spots"
                :key="spot.id"
                class="spot-card"
              >
                <span class="sc-pin"></span>
                <span class="sc-num">{{ String(idx + 1).padStart(2, '0') }}</span>
                <div class="sc-photo">
                  <img
                    v-if="spot.image"
                    :src="spot.image"
                    :alt="spot.name"
                    class="sc-img"
                    loading="lazy"
                  />
                </div>
                <div class="sc-body">
                  <div class="sc-head">
                    <span class="sc-name" @click="$emit('navigate-to-spot', spot.name)">{{ spot.name }}</span>
                    <span class="sc-rate" v-if="spot.rating"><StarIcon :size="16" /> {{ spot.rating }}</span>
                  </div>
                  <div class="sc-info">
                    <span class="sc-loc"><LocationIcon :size="13" /> {{ spot.location }}</span>
                    <span class="sc-dur" v-if="spot.visitDuration"><ClockIcon :size="13" /> {{ spot.visitDuration }}</span>
                  </div>
                  <p class="sc-desc">{{ spot.highlight || spot.description }}</p>
                </div>
                <div class="sc-side">
                  <span class="sc-price" v-if="spot.ticketPrice">{{ spot.ticketPrice }}</span>
                  <span class="sc-trans" v-if="spot.transport"><BusIcon :size="13" /> {{ spot.transport }}</span>
                </div>
                <div class="sc-actions">
                  <button class="sc-btn sc-like" :class="{ active: isSpotLike(spot.id) }" aria-label="点赞景点" @click="handleToggleLike(spot.id)">
                    <ThumbUpIcon :filled="isSpotLike(spot.id)" :size="16" />
                  </button>
                  <button class="sc-btn sc-want" :class="{ active: isSpotWant(spot.id) }" aria-label="想去景点" @click="handleToggleWant(spot.id)">
                    <HeartIcon :filled="isSpotWant(spot.id)" :size="16" />
                  </button>
                  <button class="sc-btn sc-share" aria-label="分享景点" @click="handleShare(spot)">
                    <ShareIcon :size="16" />
                  </button>
                  <button class="sc-btn sc-been" :class="{ active: isSpotBeen(spot.id) }" aria-label="去过景点" @click="handleToggleBeen(spot.id)">
                    <FlagIcon :filled="isSpotBeen(spot.id)" :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 手写贴士 -->
          <div class="tips-journal" v-if="currentTheme.tips.length">
            <span class="tj-label"><LightbulbIcon :size="20" /> 出行贴士</span>
            <ul class="tj-list">
              <li v-for="t in currentTheme.tips" :key="t">{{ t }}</li>
            </ul>
          </div>
          
        </div>
      </div>
    </section>
    <TravelShareModal
      :visible="shareVisible"
      :title="shareTitle"
      :share-text="shareText"
      :share-url="shareUrl"
      @close="closeShare"
    />
  </div>
</template>

<script setup lang="ts">
  import type { SceneryData } from '@/typesOfPages/travelGuide';
  import { computed, ref, markRaw, type Component } from 'vue';

  import GalaxyIcon from '@/pages/TravelGuide/icons/pages/scenery/GalaxyIcon.vue';
  import LayersIcon from '@/pages/TravelGuide/icons/pages/scenery/LayersIcon.vue';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import CalendarIcon from '@/pages/TravelGuide/icons/common/CalendarIcon.vue';
  import ShoppingBagIcon from '@/pages/TravelGuide/icons/common/ShoppingBagIcon.vue';
  import EnergyIcon from '@/pages/TravelGuide/icons/pages/scenery/EnergyIcon.vue';
  import UsersIcon from '@/pages/TravelGuide/icons/pages/scenery/UsersIcon.vue';
  import SparklesIcon from '@/pages/TravelGuide/icons/common/SparklesIcon.vue';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import BusIcon from '@/pages/TravelGuide/icons/pages/scenery/BusIcon.vue';
  import MapIcon from '@/pages/TravelGuide/icons/common/MapIcon.vue';
  import LightbulbIcon from '@/pages/TravelGuide/icons/common/LightbulbIcon.vue';
  import MountainIcon from '@/pages/TravelGuide/icons/pages/scenery/MountainIcon.vue';
  import DiamondIcon from '@/pages/TravelGuide/icons/pages/scenery/DiamondIcon.vue';
  import HomeIcon from '@/pages/TravelGuide/icons/common/HomeIcon.vue';
  import ZenIcon from '@/pages/TravelGuide/icons/pages/scenery/ZenIcon.vue';
  import MuseumIcon from '@/pages/TravelGuide/icons/pages/scenery/MuseumIcon.vue';
  import PaletteIcon from '@/pages/TravelGuide/icons/pages/scenery/PaletteIcon.vue';
  import LeafAutumnIcon from '@/pages/TravelGuide/icons/common/LeafAutumnIcon.vue';
  import SnowflakeIcon from '@/pages/TravelGuide/icons/common/SnowflakeIcon.vue';
  import { ThumbUpIcon, HeartIcon, ShareIcon, FlagIcon } from '@/pages/TravelGuide/icons/common';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';

  const props = defineProps<{
    sceneryData: SceneryData | null;
    loading: boolean;
  }>();

  defineEmits<{
    (e: 'navigate-to-spot', spotName: string): void;
  }>();

  const { show: showToast } = useTravelToast();
  const { isSpotLike, toggleSpotLike, isSpotWant, toggleSpotWant, isSpotBeen, toggleSpotBeen } = useSceneryPrefs();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  interface ThemeSpot {
    id: string;
    name: string;
    location: string;
    rating: number;
    ticketPrice: string;
    visitDuration: string;
    transport: string;
    description: string;
    highlight: string;
    image: string;
  }

  interface Theme {
    key: string;
    name: string;
    icon: Component;
    coverSpotName: string;
    coverImage: string;
    avgRating: number;
    bestSeason: string;
    recommendedDays: string;
    budget: string;
    intensity: string;
    audience: string;
    highlights: string[];
    tips: string[];
    spots: ThemeSpot[];
  }

  interface RawThemeSpot extends Omit<ThemeSpot, 'image'> {}
  interface RawTheme extends Omit<Theme, 'coverImage' | 'spots'> {
    spots: RawThemeSpot[];
  }

  const activeMap = ref<Record<string, string | null>>({});
  const activeGroup = ref('play');

  const groupIcon = (key: string): Component => {
    switch (key) {
      case 'play': return markRaw(MountainIcon);
      case 'culture': return markRaw(MuseumIcon);
      case 'season': return markRaw(CalendarIcon);
      default: return markRaw(GalaxyIcon);
    }
  };

  const selectTheme = (key: string) => {
    activeMap.value[activeGroup.value] = key;
  };

  const MOUNTED_GROUPS: Array<{
    key: string;
    title: string;
    items: RawTheme[];
  }> = [
    {
      key: 'play',
      title: '玩法主题',
      items: [
        {
          key: 'mountain',
          name: '名山朝圣',
          icon: markRaw(MountainIcon),
          coverSpotName: '黄山',
          avgRating: 4.8,
          bestSeason: '春秋 / 全年',
          recommendedDays: '3-4 日',
          budget: '¥600-1200',
          intensity: '适中',
          audience: '全人群',
          highlights: ['观日出云海', '奇松怪石', '佛光奇观', '冬雪雾凇'],
          tips: [
            '山顶温差大，备好防风外套与保暖衣物',
            '日出时间随季节变化，提前查好时刻表',
            '建议住山顶酒店，方便次日看日出',
          ],
          spots: [
            { id: 'hs', name: '黄山', location: '黄山市', rating: 4.9, ticketPrice: '¥190起', visitDuration: '2天', transport: '高铁+索道', description: '五绝归来不看岳', highlight: '奇松怪石云海日出冬雪，五绝奇观冠绝天下' },
            { id: 'jhs', name: '九华山', location: '池州青阳', rating: 4.7, ticketPrice: '¥160起', visitDuration: '1-2天', transport: '高铁+大巴', description: '莲花佛国九十九峰', highlight: '地藏菩萨道场，莲花佛国九十九峰' },
            { id: 'tzs', name: '天柱山', location: '安庆潜山', rating: 4.6, ticketPrice: '¥130起', visitDuration: '1-2天', transport: '高铁+公交', description: '古南岳擎天一柱', highlight: '古南岳擎天一柱，奇峰怪石飞瀑幽洞' },
            { id: 'qys', name: '齐云山', location: '休宁县', rating: 4.5, ticketPrice: '¥68起', visitDuration: '1天', transport: '自驾', description: '道教四大名山', highlight: '丹霞地貌+道教石刻，月华街云雾缭绕' },
          ],
        },
        {
          key: 'heritage',
          name: '世界遗产',
          icon: markRaw(DiamondIcon),
          coverSpotName: '宏村',
          avgRating: 4.8,
          bestSeason: '春秋',
          recommendedDays: '2-3 日',
          budget: '¥400-800',
          intensity: '轻松',
          audience: '家庭/摄影',
          highlights: ['粉墙黛瓦', '牛形水系', '徽派三雕', '倒影如画'],
          tips: [
            '古村落石板路多，穿舒适平底鞋',
            '清晨与傍晚光线最佳，适合摄影',
            '尊重原住民生活，勿擅入私宅',
          ],
          spots: [
            { id: 'hc', name: '宏村', location: '黟县', rating: 4.8, ticketPrice: '¥104起', visitDuration: '半天', transport: '自驾/大巴', description: '画里乡村牛形水系', highlight: '牛形水系古村，粉墙黛瓦倒影如画' },
            { id: 'xd', name: '西递', location: '黟县', rating: 4.6, ticketPrice: '¥94起', visitDuration: '半天', transport: '自驾/大巴', description: '船形古村牌坊群', highlight: '船形古村，明清牌坊与楹联文化' },
            { id: 'hs2', name: '黄山', location: '黄山市', rating: 4.9, ticketPrice: '¥190起', visitDuration: '2天', transport: '高铁+索道', description: '世界自然文化双遗产', highlight: '世界自然与文化双遗产，五绝奇观' },
          ],
        },
        {
          key: 'peaks',
          name: '奇峰云海',
          icon: markRaw(EnergyIcon),
          coverSpotName: '黄山',
          avgRating: 4.8,
          bestSeason: '秋冬',
          recommendedDays: '2 日',
          budget: '¥500-900',
          intensity: '适中',
          audience: '摄影/户外',
          highlights: ['云海翻涌', '日出金顶', '雾凇冰挂', '峰林夕照'],
          tips: [
            '云海多见于雨后初晴，关注天气预报',
            '秋冬出现概率最高，清晨最佳',
            '备好防滑鞋，山路湿滑注意安全',
          ],
          spots: [
            { id: 'hs3', name: '黄山', location: '黄山市', rating: 4.9, ticketPrice: '¥190起', visitDuration: '2天', transport: '高铁+索道', description: '云海日出绝佳地', highlight: '观奇松怪石云海日出冬雪，五绝奇观冠绝天下' },
            { id: 'tzs2', name: '天柱山', location: '安庆潜山', rating: 4.6, ticketPrice: '¥130起', visitDuration: '1-2天', transport: '高铁+公交', description: '擎天一柱云雾绕', highlight: '古南岳擎天一柱，奇峰怪石飞瀑幽洞' },
            { id: 'mrqf', name: '马仁奇峰', location: '芜湖繁昌', rating: 4.4, ticketPrice: '¥80起', visitDuration: '1天', transport: '自驾', description: '奇峰林立楠木成林', highlight: '奇峰林立+楠木成林，玻璃栈道观云海' },
          ],
        },
        {
          key: 'village',
          name: '古村寻幽',
          icon: markRaw(HomeIcon),
          coverSpotName: '宏村',
          avgRating: 4.6,
          bestSeason: '春秋',
          recommendedDays: '2 日',
          budget: '¥300-600',
          intensity: '轻松',
          audience: '家庭/文艺',
          highlights: ['青石板巷', '马头墙影', '溪水绕村', '田园牧歌'],
          tips: [
            '古村适合慢游，勿赶行程',
            '可住民宿体验徽州生活',
            '尊重村民生活作息，夜间保持安静',
          ],
          spots: [
            { id: 'hc2', name: '宏村', location: '黟县', rating: 4.8, ticketPrice: '¥104起', visitDuration: '半天', transport: '自驾/大巴', description: '画里乡村', highlight: '牛形水系古村，粉墙黛瓦倒影如画' },
            { id: 'xd2', name: '西递', location: '黟县', rating: 4.6, ticketPrice: '¥94起', visitDuration: '半天', transport: '自驾/大巴', description: '船形古村', highlight: '船形古村，明清牌坊与楹联文化' },
            { id: 'ck', name: '呈坎', location: '徽州区', rating: 4.5, ticketPrice: '¥107起', visitDuration: '半天', transport: '自驾', description: '八卦古村', highlight: '中国风水第一村，阴阳八卦布局' },
            { id: 'tc', name: '塔川', location: '黟县', rating: 4.4, ticketPrice: '¥40起', visitDuration: '2小时', transport: '自驾', description: '秋色绝美', highlight: '塔川秋色，层林尽染田园如画' },
          ],
        },
      ],
    },
    {
      key: 'culture',
      title: '人文体验',
      items: [
        {
          key: 'zen',
          name: '禅意养心',
          icon: markRaw(ZenIcon),
          coverSpotName: '九华山',
          avgRating: 4.7,
          bestSeason: '全年',
          recommendedDays: '2-3 日',
          budget: '¥400-800',
          intensity: '轻松',
          audience: '银发/养心',
          highlights: ['梵音晨钟', '礼佛祈福', '素斋清心', '禅修体验'],
          tips: [
            '寺庙内勿大声喧哗，着装庄重',
            '可预约寺院禅修/早课体验',
            '素斋值得一尝，提前询问用斋时间',
          ],
          spots: [
            { id: 'jhs2', name: '九华山', location: '池州青阳', rating: 4.7, ticketPrice: '¥160起', visitDuration: '1-2天', transport: '高铁+大巴', description: '地藏道场', highlight: '地藏菩萨道场，莲花佛国九十九峰' },
            { id: 'tzs3', name: '天柱山', location: '安庆潜山', rating: 4.6, ticketPrice: '¥130起', visitDuration: '1-2天', transport: '高铁+公交', description: '三祖寺禅宗', highlight: '禅宗三祖寺，道佛共融名山' },
            { id: 'sks', name: '司空山', location: '岳西县', rating: 4.3, ticketPrice: '¥60起', visitDuration: '1天', transport: '自驾', description: '禅宗二祖', highlight: '禅宗二祖慧可驻锡地，深山古寺清幽' },
          ],
        },
        {
          key: 'huipai',
          name: '徽派古韵',
          icon: markRaw(MuseumIcon),
          coverSpotName: '宏村',
          avgRating: 4.6,
          bestSeason: '春秋',
          recommendedDays: '2 日',
          budget: '¥300-600',
          intensity: '轻松',
          audience: '文化/家庭',
          highlights: ['三雕艺术', '马头墙', '天井院落', '徽商故里'],
          tips: [
            '可请讲解员，深度了解徽派建筑',
            '徽州古城墙与渔梁坝值得一看',
            '徽菜口味偏重，臭鳜鱼是招牌',
          ],
          spots: [
            { id: 'hzgc', name: '徽州古城', location: '歙县', rating: 4.5, ticketPrice: '¥100起', visitDuration: '半天', transport: '高铁+公交', description: '四大古城之一', highlight: '中国四大古城之一，许国石坊与斗山街' },
            { id: 'xd3', name: '西递', location: '黟县', rating: 4.6, ticketPrice: '¥94起', visitDuration: '半天', transport: '自驾/大巴', description: '明清古建', highlight: '船形古村，明清牌坊与楹联文化' },
            { id: 'ylb', name: '渔梁坝', location: '歙县', rating: 4.3, ticketPrice: '¥30起', visitDuration: '2小时', transport: '公交', description: '古水利工程', highlight: '江南都江堰，千年滚水坝石工奇绝' },
          ],
        },
        {
          key: 'craft',
          name: '非遗匠心',
          icon: markRaw(PaletteIcon),
          coverSpotName: '黄山',
          avgRating: 4.5,
          bestSeason: '全年',
          recommendedDays: '1-2 日',
          budget: '¥200-500',
          intensity: '轻松',
          audience: '亲子/文艺',
          highlights: ['徽墨制作', '宣纸体验', '徽剧脸谱', '竹雕手作'],
          tips: [
            '非遗体验多需预约，提前联系工坊',
            '可带孩子参与手作，寓教于乐',
            '成品可作伴手礼，支持非遗传承',
          ],
          spots: [
            { id: 'hmo', name: '徽墨工坊', location: '歙县', rating: 4.5, ticketPrice: '¥80起', visitDuration: '2小时', transport: '自驾', description: '徽墨非遗', highlight: '徽墨制作技艺，千年墨香非遗体验' },
            { id: 'xz', name: '宣纸文化园', location: '泾县', rating: 4.6, ticketPrice: '¥60起', visitDuration: '2小时', transport: '自驾', description: '纸寿千年', highlight: '宣纸制作技艺，纸寿千年非遗探秘' },
            { id: 'hj', name: '徽剧传习', location: '黄山市', rating: 4.3, ticketPrice: '¥50起', visitDuration: '1.5小时', transport: '市区公交', description: '京剧之源', highlight: '徽剧四大声腔，京剧之源脸谱彩绘' },
          ],
        },
      ],
    },
    {
      key: 'season',
      title: '季节限定',
      items: [
        {
          key: 'autumn',
          name: '秋色摄影',
          icon: markRaw(LeafAutumnIcon),
          coverSpotName: '黄山',
          avgRating: 4.7,
          bestSeason: '10-11月',
          recommendedDays: '2-3 日',
          budget: '¥500-900',
          intensity: '适中',
          audience: '摄影/文艺',
          highlights: ['层林尽染', '塔川秋色', '银杏金黄', '晨雾炊烟'],
          tips: [
            '10月下旬至11月中旬为最佳',
            '清晨晨雾+炊烟最出片',
            '备长焦镜头，远山层叠效果佳',
          ],
          spots: [
            { id: 'tc2', name: '塔川', location: '黟县', rating: 4.4, ticketPrice: '¥40起', visitDuration: '2小时', transport: '自驾', description: '秋色绝美', highlight: '塔川秋色，层林尽染田园如画' },
            { id: 'hs4', name: '黄山', location: '黄山市', rating: 4.9, ticketPrice: '¥190起', visitDuration: '2天', transport: '高铁+索道', description: '秋叶云海', highlight: '秋日层林尽染+云海日出，五绝齐现' },
            { id: 'mrqf2', name: '马仁奇峰', location: '芜湖繁昌', rating: 4.4, ticketPrice: '¥80起', visitDuration: '1天', transport: '自驾', description: '楠木秋色', highlight: '奇峰林立+楠木成林，秋色层叠' },
          ],
        },
        {
          key: 'winter',
          name: '冬日雪境',
          icon: markRaw(SnowflakeIcon),
          coverSpotName: '黄山',
          avgRating: 4.8,
          bestSeason: '12-2月',
          recommendedDays: '2 日',
          budget: '¥600-1000',
          intensity: '挑战',
          audience: '户外/摄影',
          highlights: ['雾凇冰挂', '冬雪五绝', '寒梅初绽', '温泉暖身'],
          tips: [
            '山路结冰需防滑链或冰爪',
            '山顶酒店冬季紧张，提前预订',
            '雪后初晴云海概率极高',
          ],
          spots: [
            { id: 'hs5', name: '黄山', location: '黄山市', rating: 4.9, ticketPrice: '¥150起', visitDuration: '2天', transport: '高铁+索道', description: '冬雪五绝', highlight: '冬雪雾凇冰挂，五绝齐现宛若仙境' },
            { id: 'tzs4', name: '天柱山', location: '安庆潜山', rating: 4.6, ticketPrice: '¥130起', visitDuration: '1-2天', transport: '高铁+公交', description: '雪覆奇峰', highlight: '冬雪覆奇峰，擎天一柱银装素裹' },
          ],
        },
      ],
    },
  ];

  MOUNTED_GROUPS.forEach((g) => {
    if (g.items.length) activeMap.value[g.key] = g.items[0].key;
  });

  const spotImageMap = computed<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    if (props.sceneryData?.spots) {
      props.sceneryData.spots.forEach((s) => {
        if (s.image) m[s.name] = s.image;
      });
    }
    return m;
  });

  const themeGroups = computed(() => {
    return MOUNTED_GROUPS.map((g) => ({
      key: g.key,
      title: g.title,
      items: g.items.map((t) => {
        const coverImage = spotImageMap.value[t.coverSpotName] || '';
        const spots: ThemeSpot[] = t.spots.map((s) => ({
          ...s,
          image: spotImageMap.value[s.name] || '',
        }));
        return { ...t, coverImage, spots } as Theme;
      }),
    }));
  });

  const currentGroup = computed(() => {
    return themeGroups.value.find((g) => g.key === activeGroup.value) || themeGroups.value[0];
  });

  const currentThemeKey = computed(() => activeMap.value[activeGroup.value]);

  const currentTheme = computed<Theme | null>(() => {
    const k = currentThemeKey.value;
    if (!k) return null;
    return currentGroup.value.items.find((t) => t.key === k) || null;
  });

  const handleToggleLike = (id: string) => {
    const wasLike = isSpotLike(id);
    toggleSpotLike(id);
    const spot = currentTheme.value?.spots.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasLike ? `已取消点赞 ${name}` : `已点赞 ${name}` });
  };

  const handleToggleWant = (id: string) => {
    const wasWant = isSpotWant(id);
    toggleSpotWant(id);
    const spot = currentTheme.value?.spots.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasWant ? `已移出想去清单 ${name}` : `已加入想去清单 ${name}` });
  };

  const handleToggleBeen = (id: string) => {
    const wasBeen = isSpotBeen(id);
    toggleSpotBeen(id);
    const spot = currentTheme.value?.spots.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasBeen ? `已取消 ${name} 去过标记` : `已标记 ${name} 为去过` });
  };

  const handleShare = (spot: ThemeSpot) => {
    openShare(
      spot.name,
      `${spot.name}｜${spot.location}｜评分 ${spot.rating ?? 4.5}｜门票 ${spot.ticketPrice || '免费'}`,
    );
  };
</script>

<style scoped src="./index.scss" lang="scss" />
