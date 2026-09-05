<template>
  <div class="section-content">
    <h2 class="section-title">账户设置</h2>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <UserIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">个人信息</h3>
          <p class="card-desc">管理你的基本资料</p>
        </div>
        <button class="edit-btn">
          <EditIcon :stroke-width="2" />
          编辑
        </button>
      </div>
      <div class="card-body">
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">
              <UserIcon :stroke-width="2" />
            </div>
            <div class="info-content">
              <span class="info-label">用户名</span>
              <span class="info-value">风光摄影爱好者</span>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">
              <MailIcon :stroke-width="2" />
            </div>
            <div class="info-content">
              <span class="info-label">邮箱</span>
              <span class="info-value">user@example.com</span>
            </div>
          </div>
          <div class="info-card">
            <div class="info-icon">
              <PhoneIcon :stroke-width="2" />
            </div>
            <div class="info-content">
              <span class="info-label">手机号</span>
              <span class="info-value">138****8888</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <LockIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">安全设置</h3>
          <p class="card-desc">保护你的账户安全</p>
        </div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">修改密码</span>
            <span class="item-desc">定期修改密码可以提高账户安全性</span>
          </div>
          <button class="action-btn primary">修改</button>
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">两步验证</span>
            <span class="item-desc">开启后登录需要额外验证</span>
          </div>
          <CustomSwitch v-model="twoFactorAuth" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">登录设备管理</span>
            <span class="item-desc">查看和管理已登录的设备</span>
          </div>
          <button class="action-btn">查看</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomSwitch from '../../common/CustomSwitch.vue'
import UserIcon from '@/pages/Landscape/icon/common/UserIcon.vue'
import EditIcon from '@/pages/Landscape/icon/common/EditIcon.vue'
import MailIcon from '@/pages/Landscape/icon/common/MailIcon.vue'
import PhoneIcon from '@/pages/Landscape/icon/common/PhoneIcon.vue'
import LockIcon from '@/pages/Landscape/icon/components/setting/AccountSection/LockIcon.vue'

const twoFactorAuth = ref(false)
</script>

<style lang="scss" src="./index.scss"></style>