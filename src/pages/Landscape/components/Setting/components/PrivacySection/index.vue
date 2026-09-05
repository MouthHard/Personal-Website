<template>
  <div class="section-content">
    <h2 class="section-title">隐私设置</h2>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <ShieldIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">隐私控制</h3>
          <p class="card-desc">管理你的隐私和可见性</p>
        </div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">公开个人主页</span>
            <span class="item-desc">允许他人查看你的个人主页</span>
          </div>
          <CustomSwitch v-model="publicProfile" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">公开收藏</span>
            <span class="item-desc">允许他人查看你的收藏内容</span>
          </div>
          <CustomSwitch v-model="publicCollection" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">显示在线状态</span>
            <span class="item-desc">让他人看到你的在线状态</span>
          </div>
          <CustomSwitch v-model="showOnlineStatus" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">显示地理位置</span>
            <span class="item-desc">在作品上显示拍摄地点</span>
          </div>
          <CustomSwitch v-model="showLocation" />
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <DeleteIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">数据管理</h3>
          <p class="card-desc">管理你的个人数据</p>
        </div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">浏览历史</span>
            <span class="item-desc">管理你的浏览记录</span>
          </div>
          <button class="action-btn danger">清除</button>
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">搜索历史</span>
            <span class="item-desc">管理你的搜索记录</span>
          </div>
          <button class="action-btn danger">清除</button>
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">导出数据</span>
            <span class="item-desc">下载你的所有数据</span>
          </div>
          <button class="action-btn">导出</button>
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">删除账户</span>
            <span class="item-desc">永久删除你的账户和所有数据</span>
          </div>
          <button class="action-btn danger">删除账户</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomSwitch from '../../common/CustomSwitch.vue'
import ShieldIcon from '@/pages/Landscape/icon/common/ShieldIcon.vue'
import DeleteIcon from '@/pages/Landscape/icon/components/setting/PrivacySection/DeleteIcon.vue'

const publicProfile = ref(true)
const publicCollection = ref(false)
const showOnlineStatus = ref(true)
const showLocation = ref(false)
</script>

<style lang="scss" src="./index.scss"></style>