<template>
  <div class="setting-page">
    <div class="setting-container">
      <div class="setting-header">
        <div class="header-content">
          <div class="header-icon">
            <SettingsIcon :stroke-width="1.5" class="w-6 h-6" />
          </div>
          <div class="header-title">
            <h1>设置</h1>
            <p>个性化你的风光摄影之旅</p>
          </div>
        </div>
      </div>
      <div class="setting-content">
        <SettingSidebar
          :activeSection="activeSection"
          @change="activeSection = $event"
        />
        <main class="setting-main">
          <AccountSection v-if="activeSection === 'account'" />
          <PhotographySection v-if="activeSection === 'photography'" />
          <UploadSection v-if="activeSection === 'upload'" />
          <AppearanceSection v-if="activeSection === 'appearance'" />
          <CopyrightSection v-if="activeSection === 'copyright'" />
          <NotificationsSection v-if="activeSection === 'notifications'" />
          <SocialSection v-if="activeSection === 'social'" />
          <PrivacySection v-if="activeSection === 'privacy'" />
          <AboutSection v-if="activeSection === 'about'" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineAsyncComponent } from 'vue'
  import SettingsIcon from '@/pages/Landscape/icon/common/SettingsIcon.vue'
  import SettingSidebar from './components/SettingSidebar/index.vue'
  const AccountSection = defineAsyncComponent(() => import('./components/AccountSection/index.vue'))
  const PhotographySection = defineAsyncComponent(() => import('./components/PhotographySection/index.vue'))
  const UploadSection = defineAsyncComponent(() => import('./components/UploadSection/index.vue'))
  const AppearanceSection = defineAsyncComponent(() => import('./components/AppearanceSection/index.vue'))
  const CopyrightSection = defineAsyncComponent(() => import('./components/CopyrightSection/index.vue'))
  const NotificationsSection = defineAsyncComponent(() => import('./components/NotificationsSection/index.vue'))
  const SocialSection = defineAsyncComponent(() => import('./components/SocialSection/index.vue'))
  const PrivacySection = defineAsyncComponent(() => import('./components/PrivacySection/index.vue'))
  const AboutSection = defineAsyncComponent(() => import('./components/AboutSection/index.vue'))

  defineOptions({ name: 'Setting' })
  const activeSection = ref('account');
</script>

<style lang="scss" src="./index.scss"></style>
