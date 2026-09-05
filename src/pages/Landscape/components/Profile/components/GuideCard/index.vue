<template>
  <div class="guide-card" :style="{ '--delay': delay }">
    <div class="handbook" :class="{ expanded: isExpanded }">
      <div class="book-spine"></div>

      <div class="cover">
        <div class="cover-bg">
          <div class="cover-image">
            <img v-if="item.thumbnail" :src="item.thumbnail" alt="" class="cover-img" loading="lazy" />
            <div class="image-overlay"></div>
          </div>
          <div class="leather-border"></div>
        </div>

        <div class="cover-glow"></div>

        <div class="cover-content">
          <div class="cover-top">
            <div class="destination-badge">
              <span class="dest-icon">
                <MapPinIcon />
              </span>
              <span class="dest-text">{{ item.location || '未知目的地' }}</span>
            </div>

            <div class="quick-badges">
              <span class="difficulty-seal" :class="item.difficulty || 'intermediate'">
                <StarIcon :stroke-width="2" :fill="'none'" />
                <span>{{ getDifficultyLabel(item.difficulty) }}</span>
              </span>

              <span v-if="item.isEditorPick" class="editor-pick">
                <StarIcon />
              </span>
            </div>
          </div>

          <div class="cover-body">
            <h3 class="guide-title">{{ item.title }}</h3>
            <p class="guide-summary">{{ item.summary }}</p>

          </div>

          <div class="cover-footer">
            <div class="cover-author">
              <div class="author-avatar">
                <img v-if="item.authorAvatar" :src="item.authorAvatar" :alt="item.author" class="avatar-img"
                  loading="lazy" />
                <UserIcon v-else />
              </div>
              <div class="author-info">
                <span class="author-name">{{ item.author || '未知摄影师' }}</span>
                <span class="author-date">{{ item.date || '最近更新' }}</span>
              </div>
            </div>

            <div class="cover-actions">
              <button class="cover-btn like-btn" :class="{ active: isLiked }" title="点赞" @click.stop="toggleLike">
                <ThumbUpIcon :filled="isLiked" />
                <span>{{ formatNumber(getCounts().likes) }}</span>
              </button>

              <button class="cover-btn love-btn" :class="{ active: isLoved }" title="喜爱" @click.stop="toggleLove">
                <HeartIcon :filled="isLoved" />
                <span>{{ formatNumber(getCounts().loves) }}</span>
              </button>

              <button class="cover-btn collect-btn" :class="{ active: isCollected }" title="收藏"
                @click.stop="toggleCollect">
                <BookmarkIcon :filled="isCollected" />
                <span>{{ formatNumber(getCounts().favorites) }}</span>
              </button>

              <button class="cover-btn share-btn" title="分享" @click.stop="handleShare">
                <ShareIcon />
                <span>{{ formatNumber(getCounts().shares) }}</span>
              </button>

              <button class="cover-btn view-btn" title="查看详情" @click.stop="handleClick">
                <ExpandIcon />
                <span>{{ formatNumber(getCounts().views) }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="corner-decor top-left"></div>
        <div class="corner-decor top-right"></div>
        <div class="corner-decor bottom-left"></div>
        <div class="corner-decor bottom-right"></div>

        <div class="cover-stars">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>

        <div class="cover-glow-dots">
          <div class="glow-dot"></div>
          <div class="glow-dot"></div>
          <div class="glow-dot"></div>
        </div>
      </div>

      <div class="inner-page" @click="handleClick">
        <div class="page-texture"></div>
        <div class="back-indicator">
          <ChevronLeftIcon />
          <span>点击返回封面</span>
        </div>

        <div class="inner-content" @click.stop>
          <div class="page-header">
            <h2 class="page-title">{{ item.title }}</h2>
            <p v-if="item.summary" class="page-subtitle">{{ item.summary }}</p>
          </div>

          <div class="main-section">
            <div class="info-grid">
              <div v-if="item.transport" class="info-card">
                <div class="info-icon">
                  <BoltIcon />
                </div>
                <div class="info-body">
                  <span class="info-label">交通方式</span>
                  <span class="info-value">{{ item.transport }}</span>
                </div>
              </div>

              <div v-if="item.audience" class="info-card">
                <div class="info-icon">
                  <UsersIcon />
                </div>
                <div class="info-body">
                  <span class="info-label">适合人群</span>
                  <span class="info-value">{{ item.audience }}</span>
                </div>
              </div>

              <div v-if="item.accommodation" class="info-card">
                <div class="info-icon">
                  <BuildingIcon />
                </div>
                <div class="info-body">
                  <span class="info-label">住宿建议</span>
                  <span class="info-value">{{ item.accommodation }}</span>
                </div>
              </div>

              <div v-if="item.language" class="info-card">
                <div class="info-icon">
                  <MessageBubbleIcon />
                </div>
                <div class="info-body">
                  <span class="info-label">当地语言</span>
                  <span class="info-value">{{ item.language }}</span>
                </div>
              </div>
            </div>

            <!-- 动态章节模块（完整搬用 Guides 攻略内容，不同攻略模块数量/标题/内容不同） -->
            <div v-if="item.sections?.length" class="content-sections">
              <div v-for="(section, index) in item.sections" :key="index" class="section-block">
                <h4 class="section-title">{{ section.title }}</h4>
                <ul class="section-items">
                  <li v-for="(secItem, idx) in section.items" :key="idx">{{ secItem }}</li>
                </ul>
              </div>
            </div>

            <!-- 装备分类模块 -->
            <div v-if="item.equipments?.length" class="equipments-section">
              <h4 class="section-header">
                <BoxIcon />
                装备清单
              </h4>
              <div class="equipments-grid">
                <div v-for="(equipment, index) in item.equipments" :key="index" class="equipment-card">
                  <div class="equipment-header">
                    <span class="equipment-icon"><component :is="equipmentIconMap[equipment.icon] || BoxIcon" /></span>
                    <span class="equipment-title-text">{{ equipment.title }}</span>
                  </div>
                  <ul class="equipment-items">
                    <li v-for="(eqItem, idx) in equipment.items" :key="idx">{{ eqItem }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div v-if="item.highlights?.length" class="highlights-section">
              <h4 class="section-header">
                <StarIcon :stroke-width="2" :fill="'none'" />
                核心亮点
              </h4>
              <div class="highlights-grid">
                <span v-for="(h, idx) in item.highlights" :key="idx" class="highlight-card">
                  {{ h }}
                </span>
              </div>
            </div>

            <div v-if="item.warnings?.length" class="warnings-section">
              <div class="warning-card">
                <AlertTriangleIcon />
                <div class="warning-content">
                  <span class="warning-title">注意事项</span>
                  <span class="warning-text">{{ item.warnings.join(' · ') }}</span>
                </div>
              </div>
            </div>

            <div v-if="item.shootTime || item.shootParams?.length" class="shoot-section">
              <h4 class="section-header">
                <ClockIcon />
                拍摄指南
              </h4>
              <div class="shoot-info">
                <div v-if="item.shootTime" class="shoot-time">
                  <span class="shoot-label">最佳时间</span>
                  <span class="shoot-value">{{ item.shootTime }}</span>
                </div>
                <div v-if="item.shootParams?.length" class="params-grid">
                  <div v-for="(p, idx) in item.shootParams" :key="idx" class="param-item">
                    <span class="param-label">{{ p.label }}</span>
                    <span class="param-value">{{ p.value }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.gears?.length" class="gear-section">
              <h4 class="section-header">
                <BoxIcon />
                器材清单
              </h4>
              <div class="gear-grid">
                <span v-for="(g, idx) in item.gears" :key="idx" class="gear-tag" :class="{ required: g.required }">
                  <StarIcon v-if="g.required" :style="{ width: '10px', height: '10px' }" />
                  {{ g.name }}
                </span>
              </div>
            </div>

            <div v-if="item.safety?.length" class="safety-section">
              <h4 class="section-header">
                <ShieldSimpleIcon />
                安全须知
              </h4>
              <div class="safety-list">
                <div v-for="(s, idx) in item.safety" :key="idx" class="safety-item" :class="s.type">
                  <span class="safety-title">{{ s.title }}</span>
                  <span class="safety-content">{{ s.content }}</span>
                </div>
              </div>
            </div>

            <div v-if="item.altitude || item.temperature" class="env-section">
              <div v-if="item.altitude" class="env-item">
                <LayersSimpleIcon />
                <span class="env-label">海拔</span>
                <span class="env-value">{{ item.altitude }}</span>
              </div>
              <div v-if="item.temperature" class="env-item">
                <ThermometerIcon />
                <span class="env-label">温度</span>
                <span class="env-value">{{ item.temperature }}</span>
              </div>
            </div>

            <div v-if="item.tips?.length" class="tips-section">
              <h4 class="section-header">
                <InfoIcon />
                实用贴士
              </h4>
              <ul class="tips-list">
                <li v-for="(t, idx) in item.tips" :key="idx">{{ t }}</li>
              </ul>
            </div>

            <!-- 实用提示（GuideTip 结构：title/content/type） -->
            <div v-if="item.guideTips?.length" class="guide-tips-section">
              <h4 class="section-header">
                <InfoIcon />
                实用提示
              </h4>
              <div class="guide-tips-list">
                <div v-for="(tip, index) in item.guideTips" :key="index" :class="['tip-card', `tip-${tip.type || 'info'}`]">
                  <div class="tip-icon">
                    <AlertTriangleIcon v-if="tip.type === 'warning'" />
                    <LightbulbIcon v-else-if="tip.type === 'tip'" />
                    <InfoIcon v-else />
                  </div>
                  <div class="tip-content">
                    <h5 class="tip-title">{{ tip.title }}</h5>
                    <p class="tip-text">{{ tip.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 补充信息 -->
            <div v-if="item.bestTime || item.weather || item.transportation || item.budgetDetail" class="extra-info-section">
              <h4 class="section-header">
                <ClockIcon />
                补充信息
              </h4>
              <div class="extra-info-grid">
                <div v-if="item.bestTime" class="extra-info-item">
                  <span class="extra-label">最佳时间</span>
                  <span class="extra-value">{{ item.bestTime }}</span>
                </div>
                <div v-if="item.weather" class="extra-info-item">
                  <span class="extra-label">天气情况</span>
                  <span class="extra-value">{{ item.weather }}</span>
                </div>
                <div v-if="item.transportation" class="extra-info-item">
                  <span class="extra-label">交通方式</span>
                  <span class="extra-value">{{ item.transportation }}</span>
                </div>
                <div v-if="item.budgetDetail" class="extra-info-item">
                  <span class="extra-label">预算详情</span>
                  <span class="extra-value">{{ item.budgetDetail }}</span>
                </div>
              </div>
            </div>

            <!-- 安全须知 -->
            <div v-if="item.safetyNotes?.length" class="safety-notes-section">
              <h4 class="section-header">
                <ShieldSimpleIcon />
                安全须知
              </h4>
              <ul class="safety-notes-list">
                <li v-for="(note, index) in item.safetyNotes" :key="index">{{ note }}</li>
              </ul>
            </div>

            <!-- 行程路线 -->
            <div v-if="item.routePoints?.length" class="route-section">
              <h4 class="section-header">
                <LocationIcon />
                行程路线
              </h4>
              <div class="route-timeline">
                <div v-for="(point, index) in item.routePoints" :key="index" class="route-point">
                  <div class="route-marker">{{ index + 1 }}</div>
                  <div class="route-text">{{ point }}</div>
                </div>
              </div>
            </div>

            <!-- 推荐装备 -->
            <div v-if="item.recommendedGear?.length" class="recommended-gear-section">
              <h4 class="section-header">
                <TagIcon />
                推荐装备
              </h4>
              <div class="recommended-gear-tags">
                <span v-for="(gear, index) in item.recommendedGear" :key="index" class="recommended-gear-tag">{{ gear }}</span>
              </div>
            </div>

            <!-- 后期处理 -->
            <div v-if="item.postProcessing?.length" class="post-processing-section">
              <h4 class="section-header">
                <PaletteIcon />
                后期处理
              </h4>
              <ul class="post-processing-list">
                <li v-for="(step, index) in item.postProcessing" :key="index">{{ step }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="page-shadow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showMessage } from '@/utils/landscape'
import type { GuideItem } from '@/typesOfPages/landscape'
import { formatNumber, getDifficultyLabel } from '@/utils/landscape'
import { useInteractionStore } from '@/stores/landscape'
import StarIcon from '@/pages/Landscape/icon/common/StarIcon.vue'
import UserIcon from '@/pages/Landscape/icon/common/UserIcon.vue'
import ThumbUpIcon from '@/pages/Landscape/icon/common/ThumbUpIcon.vue'
import HeartIcon from '@/pages/Landscape/icon/common/HeartIcon.vue'
import BookmarkIcon from '@/pages/Landscape/icon/common/BookmarkIcon.vue'
import ShareIcon from '@/pages/Landscape/icon/common/ShareIcon.vue'
import ChevronLeftIcon from '@/pages/Landscape/icon/common/ChevronLeftIcon.vue'
import UsersIcon from '@/pages/Landscape/icon/common/UsersIcon.vue'
import ClockIcon from '@/pages/Landscape/icon/common/ClockIcon.vue'
import LocationIcon from '@/pages/Landscape/icon/common/LocationIcon.vue'
import MessageBubbleIcon from '@/pages/Landscape/icon/components/profile/common/MessageBubbleIcon.vue'
import InfoIcon from '@/pages/Landscape/icon/common/InfoIcon.vue'
import LightbulbIcon from '@/pages/Landscape/icon/common/LightbulbIcon.vue'
import TagIcon from '@/pages/Landscape/icon/common/TagIcon.vue'
import MapPinIcon from '@/pages/Landscape/icon/common/LocationIcon.vue'
import ExpandIcon from '@/pages/Landscape/icon/components/profile/GuideCard/ExpandIcon.vue'
import BoltIcon from '@/pages/Landscape/icon/components/profile/GuideCard/BoltIcon.vue'
import BuildingIcon from '@/pages/Landscape/icon/components/profile/GuideCard/BuildingIcon.vue'
import BoxIcon from '@/pages/Landscape/icon/components/profile/GuideCard/BoxIcon.vue'
import AlertTriangleIcon from '@/pages/Landscape/icon/components/profile/GuideCard/AlertTriangleIcon.vue'
import ShieldSimpleIcon from '@/pages/Landscape/icon/common/ShieldIcon.vue'
import LayersSimpleIcon from '@/pages/Landscape/icon/common/LayersIcon.vue'
import ThermometerIcon from '@/pages/Landscape/icon/components/profile/GuideCard/ThermometerIcon.vue'
import PaletteIcon from '@/pages/Landscape/icon/components/profile/GuideCard/PaletteIcon.vue'
import CameraIcon from '@/pages/Landscape/icon/common/CameraIcon.vue'
import SearchIcon from '@/pages/Landscape/icon/common/SearchIcon.vue'
import CompassIcon from '@/pages/Landscape/icon/common/CompassIcon.vue'
import SparkleIcon from '@/pages/Landscape/icon/common/SparkleIcon.vue'

const equipmentIconMap: Record<string, any> = {
  '📷': CameraIcon,
  '🔍': SearchIcon,
  '🦿': LayersSimpleIcon,
  '💡': LightbulbIcon,
  '🧥': ShieldSimpleIcon,
  '🚗': CompassIcon,
  '🥾': LocationIcon,
  '🌸': SparkleIcon,
}

const props = defineProps<{
  item: GuideItem
  delay?: string
}>()

const emit = defineEmits<{
  (e: 'collect', id: string): void
  (e: 'like', id: string): void
  (e: 'share', item: GuideItem): void
  (e: 'click', item: GuideItem): void
}>()

const interactionStore = useInteractionStore()
const isExpanded = ref(false)

const isCollected = computed(() => interactionStore.isFavorited(props.item.id))
const isLiked = computed(() => interactionStore.isLiked(props.item.id))
const isLoved = computed(() => interactionStore.isLoved(props.item.id))

const getCounts = () => interactionStore.getCount(props.item.id)

const toggleCollect = () => {
  const item = {
    id: props.item.id,
    type: 'guide' as const,
    title: props.item.title,
    image: props.item.thumbnail || '',
    location: props.item.location,
    category: props.item.category,
    timestamp: Date.now(),
    likes: props.item.likes,
    views: props.item.views,
    favorites: props.item.saves,
    shares: props.item.shares,
    author: props.item.author,
    authorId: props.item.authorId,
    authorAvatar: props.item.authorAvatar,
  }
  const isAdded = interactionStore.toggleFavorite(item)
  if (isAdded) {
    showMessage.favorite.success(props.item.title, 'guide')
  } else {
    showMessage.favorite.cancel(props.item.title, 'guide')
  }
  emit('collect', props.item.id)
}

const toggleLike = () => {
  const isAdded = interactionStore.toggleLike(props.item.id)
  if (isAdded) {
    showMessage.like.success(props.item.title)
  } else {
    showMessage.like.cancel()
  }
  emit('like', props.item.id)
}

const toggleLove = () => {
  const item = {
    id: props.item.id,
    type: 'guide' as const,
    title: props.item.title,
    image: props.item.thumbnail || '',
    location: props.item.location,
    category: props.item.category,
    timestamp: Date.now(),
    likes: props.item.likes,
    views: props.item.views,
    favorites: props.item.saves,
    shares: props.item.shares,
    author: props.item.author,
    authorId: props.item.authorId,
    authorAvatar: props.item.authorAvatar,
  }
  const isAdded = interactionStore.toggleLove(item)
  if (isAdded) {
    showMessage.love.success(props.item.title, 'guide')
  } else {
    showMessage.love.cancel(props.item.title, 'guide')
  }
}

const handleShare = () => {
  showMessage.share.success(props.item.title)
  emit('share', props.item)
}

const handleClick = () => {
  isExpanded.value = !isExpanded.value
  emit('click', props.item)
}
</script>

<style scoped lang="scss" src="./index.scss" />