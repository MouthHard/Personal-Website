<template>
  <div class="photographer-card" :style="{ '--delay': delay }">
    <!-- 挂绳 -->
    <div class="lanyard">
      <span class="lanyard-clip"></span>
      <span class="lanyard-band"></span>
    </div>

    <!-- 证件卡主体-->
    <div class="badge-card">
      <div class="card-sheen"></div>
      <div class="holo-strip"></div>

      <!-- 卡片头部区-->
      <div class="badge-header">
        <div class="header-left">
          <span class="org-icon">
            <BadgeIcon :stroke-width="1.5" />
          </span>
          <div class="org-text">
            <span class="org-name">PHOTOGRAPHY</span>
            <span class="org-sub">PRESS CREDENTIAL</span>
          </div>
        </div>
        <div class="header-right">
          <span v-if="item.onlineStatus === 'online'" class="online-dot"></span>
          <span class="badge-id">{{ item.id.toUpperCase() }}</span>
          <span class="security-chip">
            <span class="chip-coil"></span>
            <span class="chip-core"></span>
          </span>
        </div>
      </div>

      <!-- 顶部：证件照 + 核心信息 横排 -->
      <div class="profile-row">
        <!-- 证件照-->
        <div class="id-photo-area">
          <div class="photo-border">
            <img loading="lazy" :src="item.avatar" :alt="item.name" class="id-photo" />
          </div>
          <div class="embossed-seal"></div>
          <div v-if="item.verified" class="verified-stamp">
            <CheckIcon :stroke-width="2.5" />
          </div>
        </div>

        <!-- 核心文字信息 -->
        <div class="core-info">
          <div class="name-line">
            <h3 class="person-name">{{ item.name }}</h3>
            <span v-if="item.rating" class="person-rating">
              <StarIcon />
              {{ item.rating }}
            </span>
          </div>
          <p class="person-title">{{ item.title }}</p>
          <div class="meta-line">
            <span v-if="item.location" class="meta-item">
              <LocationIcon />
              {{ item.location }}
            </span>
            <span v-if="item.experience" class="meta-item">
              <ZapIcon :stroke-width="1.5" />
              {{ item.experience }}
            </span>
            <span v-if="item.joinDate" class="meta-item">
              <CalendarIcon :stroke-width="1.5" />
              {{ item.joinDate }}
            </span>
          </div>
          <p v-if="item.bio" class="person-bio">{{ item.bio }}</p>
          <div v-if="item.equipment" class="equip-line">
            <CameraIcon :stroke-width="1.5" />
            <span>{{ item.equipment }}</span>
          </div>
          <!-- 奖项区-->
          <div v-if="item.awards && item.awards.length" class="awards-line">
            <AwardIcon :stroke-width="1.5" />
            <span v-for="award in item.awards.slice(0, 3)" :key="award" class="award-tag">{{ award }}</span>
          </div>
        </div>
      </div>

      <!-- 统计行：全宽4列-->
      <div class="stats-row">
        <div class="stat-cell">
          <ImageIcon :stroke-width="1.5" />
          <span class="stat-val">{{ item.works }}</span>
          <span class="stat-label">作品</span>
        </div>
        <div class="stat-cell">
          <UsersIcon :stroke-width="1.5" />
          <span class="stat-val">{{ item.followers }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-cell">
          <EyeIcon :stroke-width="1.5" />
          <span class="stat-val">{{ item.views || '0' }}</span>
          <span class="stat-label">浏览</span>
        </div>
        <div class="stat-cell">
          <HeartIcon :stroke-width="1.5" />
          <span class="stat-val">{{ item.likes || '0' }}</span>
          <span class="stat-label">获赞</span>
        </div>
      </div>

      <!-- 标签 + 社交 + 联系 一行-->
      <div class="info-strip">
        <div class="tags-group">
          <span v-for="tag in item.tags.slice(0, 4)" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="divider-dot"></div>
        <div v-if="item.socials && item.socials.length" class="socials-group">
          <a v-for="s in item.socials" :key="s.platform" class="social-icon" :title="s.platform">
            <svg viewBox="0 0 24 24" fill="currentColor" v-html="s.iconPath"></svg>
          </a>
        </div>
        <div v-if="item.contact" class="divider-dot"></div>
        <div v-if="item.contact" class="contact-group">
          <span v-if="item.contact.email" class="contact-item" :title="item.contact.email">
            <MailSimpleIcon :stroke-width="1.5" />
          </span>
          <span v-if="item.contact.website" class="contact-item" :title="item.contact.website">
            <GlobeIcon :stroke-width="1.5" />
          </span>
          <span v-if="item.contact.phone" class="contact-item" :title="item.contact.phone">
            <PhoneIcon :stroke-width="1.5" />
          </span>
        </div>
      </div>

      <!-- 作品横排3张大图-->
      <div v-if="item.recentWorks && item.recentWorks.length > 0" class="works-row">
        <div class="works-label">
          <span>代表作品</span>
          <span class="works-count">{{ item.works }}</span>
        </div>
        <div class="works-gallery">
          <div
            v-for="(work, idx) in item.recentWorks.slice(0, 3)"
            :key="idx"
            class="work-item"
          >
            <img loading="lazy" :src="work" alt="recent work" />
            <div class="work-overlay">
              <ArrowRightIcon />
            </div>
            <div
              v-if="idx === item.recentWorks.length - 1 && item.worksCount > item.recentWorks.length"
              class="work-more"
            >
              <span>+{{ item.worksCount - item.recentWorks.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 条码 -->
      <div class="barcode-strip">
        <span class="barcode"></span>
        <span class="barcode-text">{{ item.id.toUpperCase() }}</span>
      </div>

      <!-- 底部操作栏-->
      <div class="action-bar">
        <button
          class="action-btn follow-btn"
          :class="{ following: isFollowing }"
          @click.stop="toggleFollow"
        >
          <UserPlusIcon v-if="!isFollowing" />
          <CheckIcon v-else :stroke-width="2.5" />
          <span>{{ isFollowing ? '已关注' : '关注' }}</span>
        </button>
        <button class="action-btn like-btn" :class="{ liked: isLiked }" @click.stop="toggleLike">
          <HeartIcon :filled="isLiked" />
          <span>{{ isLiked ? '已赞' : '点赞' }}</span>
        </button>

        <button class="action-btn share-btn" @click.stop>
          <ShareIcon />
          <span>分享</span>
        </button>
        <button class="action-btn msg-btn" @click.stop>
          <MessageBubbleIcon />
          <span>私信</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showMessage } from '@/utils/landscape'
import type { PhotographerItem } from '@/typesOfPages/landscape'
import { useInteractionStore } from '@/stores/landscape'
import CheckIcon from '@/pages/Landscape/icon/common/CheckIcon.vue'
import StarIcon from '@/pages/Landscape/icon/common/StarIcon.vue'
import LocationIcon from '@/pages/Landscape/icon/common/LocationIcon.vue'
import ZapIcon from '@/pages/Landscape/icon/components/profile/common/ZapIcon.vue'
import CalendarIcon from '@/pages/Landscape/icon/common/CalendarIcon.vue'
import CameraIcon from '@/pages/Landscape/icon/common/CameraIcon.vue'
import ImageIcon from '@/pages/Landscape/icon/common/ImageIcon.vue'
import UsersIcon from '@/pages/Landscape/icon/common/UsersIcon.vue'
import EyeIcon from '@/pages/Landscape/icon/common/EyeIcon.vue'
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue'
import ArrowRightIcon from '@/pages/Landscape/icon/common/ArrowRightIcon.vue'
import UserPlusIcon from '@/pages/Landscape/icon/common/UserPlusIcon.vue'
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue'
import MessageBubbleIcon from '@/pages/Landscape/icon/components/profile/common/MessageBubbleIcon.vue'
import GlobeIcon from '@/pages/Landscape/icon/common/GlobeIcon.vue'
import PhoneIcon from '@/pages/Landscape/icon/common/PhoneIcon.vue'
import BadgeIcon from '@/pages/Landscape/icon/components/profile/PhotographerCard/BadgeIcon.vue'
import AwardIcon from '@/pages/Landscape/icon/components/profile/PhotographerCard/AwardIcon.vue'
import MailSimpleIcon from '@/pages/Landscape/icon/common/MailIcon.vue'

const props = defineProps<{
  item: PhotographerItem;
  delay?: string;
}>();

const emit = defineEmits<{
  (e: 'follow', id: string): void;
}>();

const interactionStore = useInteractionStore()
const isFollowing = computed(() => interactionStore.isFollowing(props.item.id))
const isLiked = computed(() => interactionStore.isLiked(props.item.id))


const toggleFollow = () => {
  const wasFollowing = isFollowing.value
  const isAdded = interactionStore.toggleFollowPhotographer(props.item.id)
  if (wasFollowing && !isAdded) {
    showMessage.follow.cancel(props.item.name)
  } else if (!wasFollowing && isAdded) {
    showMessage.follow.success(props.item.name)
  }
  emit('follow', props.item.id)
}

const toggleLike = () => {
  const wasLiked = isLiked.value
  const isAdded = interactionStore.toggleLike({
    id: props.item.id,
    type: 'photographer',
    title: props.item.name,
    image: props.item.avatar,
    timestamp: Date.now(),
  })
  if (!wasLiked && isAdded) {
    showMessage.like.success(props.item.name)
  } else if (wasLiked && !isAdded) {
    showMessage.like.cancel()
  }
}

</script>

<style scoped lang="scss" src="./index.scss" />
