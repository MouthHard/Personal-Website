<template>
  <div class="section-content">
    <h2 class="section-title">关于我们</h2>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <InfoIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">关于平台</h3>
          <p class="card-desc">了解风光摄影社区</p>
        </div>
      </div>
      <div class="card-body">
        <div class="info-row">
          <span class="info-label">平台名称</span>
          <span class="info-value">风光摄影社区</span>
        </div>
        <div class="info-row">
          <span class="info-label">版本号</span>
          <span class="info-value">v2.0.0</span>
        </div>
        <div class="info-row">
          <span class="info-label">创立时间</span>
          <span class="info-value">2024年</span>
        </div>
        <div class="info-row">
          <span class="info-label">用户数量</span>
          <span class="info-value">50,000+</span>
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <FileIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">服务条款</h3>
          <p class="card-desc">查看相关协议</p>
        </div>
      </div>
      <div class="card-body">
        <div class="terms-list">
          <div 
            v-for="(item, index) in termsItems" 
            :key="index" 
            class="terms-item"
            @click="showToast"
          >
            <div class="terms-icon">
              <component :is="item.icon" :stroke-width="2" />
            </div>
            <span class="terms-text">{{ item.text }}</span>
            <div class="terms-badge">
              <SmileIcon :stroke-width="2" />
            </div>
          </div>
        </div>
        <div class="terms-hint">
          <InfoIcon :stroke-width="2" />
          <span>条款内容正在完善中，敬请期待</span>
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <UserIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">联系我们</h3>
          <p class="card-desc">如有问题请联系我们</p>
        </div>
      </div>
      <div class="card-body">
        <div class="info-row">
          <span class="info-label">邮箱</span>
          <span class="info-value">support@landscape.com</span>
        </div>
        <div class="info-row">
          <span class="info-label">微信</span>
          <span class="info-value">Landscape_Support</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, h, render, onUnmounted } from 'vue'
import InfoIcon from '@/pages/Landscape/icon/common/InfoIcon.vue'
import FileIcon from '@/pages/Landscape/icon/components/setting/AboutSection/FileIcon.vue'
import SmileIcon from '@/pages/Landscape/icon/components/setting/AboutSection/SmileIcon.vue'
import UserIcon from '@/pages/Landscape/icon/common/UserIcon.vue'
import HomeIcon from '@/pages/Landscape/icon/components/setting/AboutSection/HomeIcon.vue'
import GlobeDetailIcon from '@/pages/Landscape/icon/components/setting/AboutSection/GlobeDetailIcon.vue'
import FileTextIcon from '@/pages/Landscape/icon/components/setting/AboutSection/FileTextIcon.vue'

defineOptions({
  name: 'AboutSection'
})

const termsItems = ref([
  { 
    icon: markRaw(FileTextIcon),
    text: '用户协议' 
  },
  { 
    icon: markRaw(GlobeDetailIcon),
    text: '隐私政策' 
  },
  { 
    icon: markRaw(HomeIcon),
    text: '帮助中心' 
  }
])

let toastTimers: ReturnType<typeof setTimeout>[] = [];

const showToast = () => {
  const toast = document.createElement('div')
  toast.className = 'terms-toast'
  const iconWrap = document.createElement('span')
  iconWrap.className = 'terms-toast-icon'
  render(h(InfoIcon, { strokeWidth: 2 }), iconWrap)
  toast.appendChild(iconWrap)
  const textWrap = document.createElement('span')
  textWrap.textContent = '条款内容正在完善中'
  toast.appendChild(textWrap)
  document.body.appendChild(toast)
  
  const t1 = setTimeout(() => {
    toast.classList.add('fade-out')
    const t2 = setTimeout(() => {
      render(null, iconWrap)
      if (toast.parentNode) document.body.removeChild(toast)
      toastTimers = toastTimers.filter(t => t !== t2)
    }, 300)
    toastTimers.push(t2)
    toastTimers = toastTimers.filter(t => t !== t1)
  }, 2000)
  toastTimers.push(t1)
}

onUnmounted(() => {
  toastTimers.forEach(clearTimeout)
  toastTimers = []
})
</script>

<style lang="scss" src="./index.scss"></style>