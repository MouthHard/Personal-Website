<template>
  <header class="landscape-header">
    <div class="logo" @click="router.push('/landscape/home')">
      <div class="logo-icon">
        <CameraIcon :stroke-width="2" />
      </div>
      <span class="logo-text">风景</span>
    </div>

    <nav class="category-nav">
      <router-link v-for="nav in mainNavs" :key="nav.path" :to="nav.path" class="nav-item"
        :class="{ active: isActiveNav(nav.path) }">
        <div v-if="isActiveNav(nav.path)" class="active-indicator-left">
          <CameraIcon :stroke-width="2.5" />
        </div>
        <span class="nav-icon">
          <component :is="navIconMap[nav.path]" :stroke-width="2" />
        </span>
        <span class="nav-text">{{ nav.name }}</span>
        <div v-if="isActiveNav(nav.path)" class="active-indicator-right">
          <SunAltIcon />
        </div>
      </router-link>
    </nav>


    <div class="user-actions">
      <button class="action-btn upload-btn" title="上传作品" @click="emit('open-upload')">
        <UploadIcon :stroke-width="2" />
        <span class="btn-text">上传</span>
      </button>
      <button class="action-btn settings-btn" title="设置" @click="goToSettings">
        <SettingsIcon   />
        <span class="btn-text">设置</span>
      </button>
      <button class="action-btn home-btn" title="返回网站主页" @click="goToHome">
        <BuildingIcon :stroke-width="2" />
        <span class="btn-text">返回网站主页</span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import type { Component } from 'vue';
import CameraIcon from '@/pages/Landscape/icon/common/CameraIcon.vue';
import UploadIcon from '@/pages/Landscape/icon/common/UploadIcon.vue';
import BuildingIcon from '@/pages/Landscape/icon/common/BuildingIcon.vue';
import SettingsIcon from '@/pages/Landscape/icon/common/SettingsIcon.vue';
import SunAltIcon from '@/pages/Landscape/icon/common/SunIcon.vue';
import NavHomeIcon from '@/pages/Landscape/icon/components/header/NavHomeIcon.vue';
import NavCategoryIcon from '@/pages/Landscape/icon/components/header/NavCategoryIcon.vue';
import NavGuidesIcon from '@/pages/Landscape/icon/components/header/NavGuidesIcon.vue';
import NavPhotographersIcon from '@/pages/Landscape/icon/components/header/NavPhotographersIcon.vue';
import NavProfileIcon from '@/pages/Landscape/icon/components/header/NavProfileIcon.vue';
import NavSearchIcon from '@/pages/Landscape/icon/components/header/NavSearchIcon.vue';
import { mainNavs } from '@/utils/landscape/constants';

const router = useRouter();
const route = useRoute();
const emit = defineEmits<{
  'open-upload': [];
}>();

const navIconMap: Record<string, Component> = {
  '/landscape/home': NavHomeIcon,
  '/landscape/search': NavSearchIcon,
  '/landscape/category': NavCategoryIcon,
  '/landscape/guides': NavGuidesIcon,
  '/landscape/photographers': NavPhotographersIcon,
  '/landscape/profile': NavProfileIcon,
};

const isActiveNav = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const goToHome = () => {
  router.push('/');
};

const goToSettings = () => {
  router.push('/landscape/setting');
};
</script>

<style scoped lang="scss" src="./index.scss" />
