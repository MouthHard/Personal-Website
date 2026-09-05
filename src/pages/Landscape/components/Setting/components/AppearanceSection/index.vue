<template>
  <div class="section-content">
    <h2 class="section-title">外观设置</h2>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <MoonIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">主题模式</h3>
          <p class="card-desc">选择你喜欢的界面主题</p>
        </div>
      </div>
      <div class="card-body">
        <div class="theme-options">
          <label class="theme-option">
            <input type="radio" name="theme" value="dark" checked />
            <div class="option-content">
              <div class="option-icon dark-icon">
                <MoonIcon fill="currentColor" />
              </div>
              <span class="option-label">深色模式</span>
            </div>
          </label>
          <label class="theme-option">
            <input type="radio" name="theme" value="light" />
            <div class="option-content">
              <div class="option-icon light-icon">
                <SunIcon :stroke-width="2" />
              </div>
              <span class="option-label">浅色模式</span>
            </div>
          </label>
          <label class="theme-option">
            <input type="radio" name="theme" value="auto" />
            <div class="option-content">
              <div class="option-icon auto-icon">
                <MonitorIcon :stroke-width="2" />
              </div>
              <span class="option-label">跟随系统</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <PaintIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">显示设置</h3>
          <p class="card-desc">自定义界面显示效果</p>
        </div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">卡片阴影</span>
            <span class="item-desc">为卡片添加立体阴影效果</span>
          </div>
          <CustomSwitch v-model="cardShadow" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">动画效果</span>
            <span class="item-desc">启用页面过渡和交互动画</span>
          </div>
          <CustomSwitch v-model="animationEffect" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">紧凑模式</span>
            <span class="item-desc">减少间距以显示更多内容</span>
          </div>
          <CustomSwitch v-model="compactMode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomSwitch from '../../common/CustomSwitch.vue'
import MoonIcon from '@/pages/Landscape/icon/components/setting/AppearanceSection/MoonIcon.vue'
import SunIcon from '@/pages/Landscape/icon/common/SunIcon.vue'
import MonitorIcon from '@/pages/Landscape/icon/components/setting/AppearanceSection/MonitorIcon.vue'
import PaintIcon from '@/pages/Landscape/icon/components/setting/AppearanceSection/PaintIcon.vue'

const cardShadow = ref(true)
const animationEffect = ref(true)
const compactMode = ref(false)
</script>

<style lang="scss" src="./index.scss"></style>