<template>
  <div class="section-content">
    <h2 class="section-title">上传设置</h2>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <UploadIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">自动处理</h3>
          <p class="card-desc">设置图片上传时的自动处理</p>
        </div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">自动提取EXIF</span>
            <span class="item-desc">自动提取并显示拍摄参数</span>
          </div>
          <CustomSwitch v-model="autoExtractExif" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">智能标签</span>
            <span class="item-desc">AI自动为图片添加标签</span>
          </div>
          <CustomSwitch v-model="smartTags" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">自动分类</span>
            <span class="item-desc">根据内容自动分类到相册</span>
          </div>
          <CustomSwitch v-model="autoClassify" />
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <ActivityIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">图片优化</h3>
          <p class="card-desc">优化图片以提升加载速度</p>
        </div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">图片压缩</span>
            <span class="item-desc">上传时自动压缩图片大小</span>
          </div>
          <CustomSwitch v-model="imageCompression" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">压缩质量</span>
            <span class="item-desc">平衡文件大小和图片质量</span>
          </div>
          <CustomSelect 
            v-model="compressionQuality" 
            :options="qualityOptions"
            placeholder="选择质量"
          />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">WebP格式</span>
            <span class="item-desc">优先使用WebP格式存储</span>
          </div>
          <CustomSwitch v-model="webpFormat" />
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <LayoutGridIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">默认隐私</h3>
          <p class="card-desc">新上传作品的默认可见性</p>
        </div>
      </div>
      <div class="card-body">
        <div class="privacy-tabs">
          <button 
            v-for="privacy in privacyOptions" 
            :key="privacy.value"
            :class="['privacy-tab', privacy.value, { active: selectedPrivacy === privacy.value }]"
            @click="selectedPrivacy = privacy.value"
          >
            <span class="privacy-icon" :class="privacy.value"></span>
            <span class="privacy-name">{{ privacy.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomSwitch from '../../common/CustomSwitch.vue'
import CustomSelect from '../../common/CustomSelect.vue'
import UploadIcon from '@/pages/Landscape/icon/common/UploadIcon.vue'
import ActivityIcon from '@/pages/Landscape/icon/components/setting/UploadSection/ActivityIcon.vue'
import LayoutGridIcon from '@/pages/Landscape/icon/components/setting/UploadSection/LayoutGridIcon.vue'
import { UploadQualityOptions, UploadPrivacyOptions } from '@/utils/landscape/constants'

const autoExtractExif = ref(true)
const smartTags = ref(true)
const autoClassify = ref(false)
const imageCompression = ref(true)
const compressionQuality = ref('平衡')
const webpFormat = ref(true)
const selectedPrivacy = ref('public')

const qualityOptions = UploadQualityOptions

const privacyOptions = UploadPrivacyOptions
</script>

<style lang="scss" src="./index.scss"></style>