<template>
  <div class="section-content">
    <h2 class="section-title">版权设置</h2>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <CopyrightIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">版权信息</h3>
          <p class="card-desc">设置作品的版权归属</p>
        </div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">版权类型</span>
            <span class="item-desc">选择你的作品版权类型</span>
          </div>
          <CustomSelect 
            v-model="copyrightType" 
            :options="copyrightOptions"
            placeholder="选择版权类型"
          />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">署名要求</span>
            <span class="item-desc">是否要求署名</span>
          </div>
          <CustomSwitch v-model="requireCredit" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">商业使用</span>
            <span class="item-desc">允许商业使用你的作品</span>
          </div>
          <CustomSwitch v-model="commercialUse" />
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <LicenseIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">授权管理</h3>
          <p class="card-desc">管理作品的授权许可</p>
        </div>
      </div>
      <div class="card-body">
        <div class="info-row">
          <span class="info-label">已授权作品</span>
          <span class="info-value">12 件</span>
        </div>
        <div class="info-row">
          <span class="info-label">授权收入</span>
          <span class="info-value">¥ 2,800</span>
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">自动授权</span>
            <span class="item-desc">接受符合条件的授权请求</span>
          </div>
          <CustomSwitch v-model="autoLicense" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomSelect from '../../common/CustomSelect.vue'
import CustomSwitch from '../../common/CustomSwitch.vue'
import CopyrightIcon from '@/pages/Landscape/icon/components/setting/CopyrightSection/CopyrightIcon.vue'
import LicenseIcon from '@/pages/Landscape/icon/components/setting/CopyrightSection/LicenseIcon.vue'
import { CopyrightOptions } from '@/utils/landscape/constants'

const copyrightType = ref('保留所有权利')
const requireCredit = ref(true)
const commercialUse = ref(false)
const autoLicense = ref(false)

const copyrightOptions = CopyrightOptions
</script>

<style lang="scss" src="./index.scss"></style>