<template>
  <div class="section-content">
    <h2 class="section-title">社交集成</h2>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <FacebookIcon />
        </div>
        <div>
          <h3 class="card-title">绑定社交账号</h3>
          <p class="card-desc">关联你的社交媒体账号</p>
        </div>
      </div>
      <div class="card-body">
        <div class="social-item linked">
          <div class="social-info">
            <div class="social-icon weibo">
              <WeiboIcon />
            </div>
            <div>
              <span class="social-name">微博</span>
              <span class="social-status">已绑定：@风光摄影师</span>
            </div>
          </div>
          <button class="action-btn danger">解绑</button>
        </div>
        <div class="social-item">
          <div class="social-info">
            <div class="social-icon wechat">
              <WechatIcon />
            </div>
            <div>
              <span class="social-name">微信</span>
              <span class="social-status">未绑定</span>
            </div>
          </div>
          <button class="action-btn primary">绑定</button>
        </div>
        <div class="social-item">
          <div class="social-info">
            <div class="social-icon ins">
              <InstagramFilledIcon />
            </div>
            <div>
              <span class="social-name">Instagram</span>
              <span class="social-status">未绑定</span>
            </div>
          </div>
          <button class="action-btn primary">绑定</button>
        </div>
        <div class="social-item">
          <div class="social-info">
            <div class="social-icon twitter">
              <TwitterIcon fill="currentColor" :stroke-width="0" />
            </div>
            <div>
              <span class="social-name">Twitter/X</span>
              <span class="social-status">未绑定</span>
            </div>
          </div>
          <button class="action-btn primary">绑定</button>
        </div>
      </div>
    </div>

    <div class="setting-card">
      <div class="card-header">
        <div class="card-icon">
          <UploadShareIcon :stroke-width="2" />
        </div>
        <div>
          <h3 class="card-title">自动分享</h3>
          <p class="card-desc">发布作品时自动分享到社交平台</p>
        </div>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">微博自动分享</span>
            <span class="item-desc">发布新作品时自动分享到微博</span>
          </div>
          <CustomSwitch v-model="weiboAutoShare" />
        </div>
        <div class="setting-item">
          <div class="item-info">
            <span class="item-label">Twitter自动分享</span>
            <span class="item-desc">发布新作品时自动分享到Twitter</span>
          </div>
          <CustomSwitch v-model="twitterAutoShare" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomSwitch from '../../common/CustomSwitch.vue'
import FacebookIcon from '@/pages/Landscape/icon/components/setting/SocialSection/FacebookIcon.vue'
import WeiboIcon from '@/pages/Landscape/icon/common/WeiboIcon.vue'
import WechatIcon from '@/pages/Landscape/icon/common/WechatIcon.vue'
import InstagramFilledIcon from '@/pages/Landscape/icon/common/InstagramFilledIcon.vue'
import TwitterIcon from '@/pages/Landscape/icon/common/TwitterIcon.vue'
import UploadShareIcon from '@/pages/Landscape/icon/components/setting/SocialSection/UploadShareIcon.vue'

const weiboAutoShare = ref(false)
const twitterAutoShare = ref(false)
</script>

<style lang="scss" src="./index.scss"></style>