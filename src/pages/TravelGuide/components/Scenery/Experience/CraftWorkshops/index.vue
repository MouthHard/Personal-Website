<template>
  <section class="craft-workshops">
    <div class="workshop-layout">
      <aside class="control-station">

        <div class="station-header">
          <div class="header-title-group">
            <span class="header-title">手作工坊</span>
            <span class="header-dots">
              <i class="dot"></i>
              <i class="dot"></i>
              <i class="dot"></i>
            </span>
          </div>
          <span class="header-display">
            <span class="display-digit">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
            <span class="display-sep">/</span>
            <span class="display-total">{{ String(items.length).padStart(2, '0') }}</span>
          </span>
        </div>

        <div class="locker-rack">
          <button v-for="(item, index) in items" :key="item.id || index" class="locker-door"
            :class="{ active: index === activeIndex }" @click="activeIndex = index">
            <div class="door-label">
              <div class="label-name">{{ item.name }}</div>
              <div class="label-bottom">
                <span v-if="item.heritageLevel" class="info-heritage">
                  {{ heritageShort[item.heritageLevel] || '非遗' }}
                </span>
                <span class="toggle-switch">
                  <span class="bolt-hole bolt-tl"></span>
                  <span class="bolt-hole bolt-tr"></span>
                  <span class="bolt-hole bolt-bl"></span>
                  <span class="bolt-hole bolt-br"></span>
                  <span class="toggle-knob"></span>
                </span>
              </div>
            </div>
          </button>
        </div>
      </aside>

      <div v-if="currentItem" class="detail-panel">

        <div class="detail-upper">
          <div class="detail-image-frame">
            <span class="frame-screw screw-tl"></span>
            <span class="frame-screw screw-tr"></span>
            <span class="frame-screw screw-bl"></span>
            <span class="frame-screw screw-br"></span>
            <img loading="lazy" :src="currentItem.image" :alt="currentItem.name" class="detail-image" />
            <div class="image-gradient-overlay"></div>
            <div v-if="currentItem.heritageLevel" class="heritage-badge">
              <span class="badge-text">{{ heritageLabel[currentItem.heritageLevel] || '非遗' }}</span>
            </div>
            <div class="image-type-tag">{{ currentItem.type }}</div>
          </div>

          <div class="detail-info">
            <div class="content-top">
              <div class="content-header">
                <h4 class="content-title">{{ currentItem.name }}</h4>
                <span class="content-index">No.{{ String(activeIndex + 1).padStart(2, '0') }}</span>
              </div>
              <div v-if="currentItem.rating || currentItem.price" class="content-meta">
                <div v-if="currentItem.rating" class="meta-rating">
                  <span class="rating-star">★</span>
                  <span class="rating-val">{{ currentItem.rating.toFixed(1) }}</span>
                  <span v-if="currentItem.reviewCount" class="rating-count">· {{ currentItem.reviewCount }}条</span>
                </div>
                <div v-if="currentItem.price" class="meta-price">
                  <span class="price-val">¥{{ currentItem.price }}</span>
                </div>
              </div>
            </div>

            <p class="content-desc">{{ currentItem.description }}</p>

            <div class="content-info-row">
              <div class="info-item">
                <span class="info-key">地点</span>
                <span class="info-val">{{ currentItem.location }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">耗时</span>
                <span class="info-val">{{ currentItem.duration }}</span>
              </div>
              <div class="info-item">
                <span class="info-key">难度</span>
                <span class="info-val" :data-level="currentItem.difficulty">{{ currentItem.difficulty }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-content">
          <div class="content-grid">
            <div class="grid-col">
              <div v-if="currentItem.highlights?.length" class="content-section">
                <span class="section-label">亮点特色</span>
                <ul class="highlights-list">
                  <li v-for="(h, hi) in currentItem.highlights" :key="hi" class="highlight-item">

                    <span class="highlight-text">{{ h }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="currentItem.instructor" class="content-section">
                <span class="section-label">传承人</span>
                <div class="instructor-box">
                  <span class="instructor-icon">⚙</span>
                  <span class="instructor-name">{{ currentItem.instructor }}</span>
                </div>
              </div>

              <div v-if="currentItem.suitableFor?.length" class="content-section">
                <span class="section-label">适合人群</span>
                <div class="audience-tags">
                  <span v-for="(a, ai) in currentItem.suitableFor" :key="ai" class="audience-tag">{{ a }}</span>
                </div>
              </div>
            </div>

            <div class="grid-col">
              <div v-if="currentItem.steps?.length" class="content-section">
                <span class="section-label">体验工序</span>
                <div class="steps-rack">
                  <div v-for="(s, si) in currentItem.steps" :key="si" class="step-plate"
                    :class="{ 'plate-active': si === currentItem.steps.length - 1 }">
                    <span class="plate-rivet">
                      <span class="rivet-core">{{ Number(si) + 1 }}</span>
                    </span>

                    <span class="plate-text">{{ s }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="content-bottom">
            <div class="content-tags">
              <span v-for="(tag, ti) in (currentItem.tags || []).slice(0, 4)" :key="ti" class="content-tag"
                :class="{ 'tag-heritage': tag.includes('非遗') || tag.includes('传承') }">{{ tag }}</span>
            </div>
            <div class="content-actions">
              <button
                class="action-btn btn-fav"
                :class="{ 'is-active': isExperienceFavorite(currentItem.id, provinceId, 'craft') }"
                @click="onToggleFavorite(currentItem)"
              >
                <span class="btn-rivet rivet-tl"></span>
                <span class="btn-rivet rivet-br"></span>
                <span class="btn-icon-socket">
                  <BookmarkIcon :size="15" :filled="isExperienceFavorite(currentItem.id, provinceId, 'craft')" />
                </span>
                <span class="btn-label">{{ isExperienceFavorite(currentItem.id, provinceId, 'craft') ? '已收藏' : '收藏' }}</span>
              </button>
              <button
                class="action-btn btn-been"
                :class="{ 'is-active': isExperienceBeen(currentItem.id, provinceId, 'craft') }"
                @click="onToggleBeen(currentItem)"
              >
                <span class="btn-rivet rivet-tl"></span>
                <span class="btn-rivet rivet-br"></span>
                <span class="btn-icon-socket">
                  <FlagIcon :size="15" :filled="isExperienceBeen(currentItem.id, provinceId, 'craft')" />
                </span>
                <span class="btn-label">{{ isExperienceBeen(currentItem.id, provinceId, 'craft') ? '已体验' : '体验' }}</span>
              </button>
              <button
                class="action-btn btn-share"
                @click="shareExperience(currentItem)"
              >
                <span class="btn-rivet rivet-tl"></span>
                <span class="btn-rivet rivet-br"></span>
                <span class="btn-icon-socket">
                  <ShareIcon :size="15" />
                </span>
                <span class="btn-label">分享</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="detail-panel empty-detail">
        <span class="empty-screw screw-tl"></span>
        <span class="empty-screw screw-tr"></span>
        <span class="empty-screw screw-bl"></span>
        <span class="empty-screw screw-br"></span>
        <div class="empty-cast-plate">
          <div class="empty-gear-housing">
            <span class="empty-gear-ring"></span>
            <span class="empty-gear-core">
              <span class="empty-icon"><PaletteIcon /></span>
            </span>
          </div>
          <h4 class="empty-title">工坊正在筹备中</h4>
          <p class="empty-desc">该地区的手作工坊体验正在采集中</p>
          <div class="empty-status-bar">
            <span class="status-led"></span>
            <span class="status-text">采集中</span>
            <span class="status-progress">
              <span class="progress-fill"></span>
            </span>
          </div>
          <div class="empty-craft-tags">
            <span class="craft-tag">木雕</span>
            <span class="craft-tag">陶艺</span>
            <span class="craft-tag">竹编</span>
            <span class="craft-tag">漆器</span>
          </div>
        </div>
      </div>
    </div>

    <TravelShareModal
      :visible="shareVisible"
      :title="shareTitle"
      :share-text="shareText"
      :share-url="shareUrl"
      @close="closeShare"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import PaletteIcon from '../../../../icons/pages/scenery/PaletteIcon.vue';
import BookmarkIcon from '../../../../icons/common/BookmarkIcon.vue';
 
import FlagIcon from '../../../../icons/common/FlagIcon.vue';
import ShareIcon from '../../../../icons/common/ShareIcon.vue';

import { useTravelShare } from '../../../TravelShareModal/useTravelShare';
import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
import TravelShareModal from '../../../TravelShareModal/index.vue';
const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();
const { show: showToast } = useTravelToast();
const {
  isExperienceFavorite,
 
  isExperienceBeen,
  toggleExperienceFavorite,
 
  toggleExperienceBeen,
} = useSceneryPrefs();

const shareExperience = (item: any): void => {
  if (!item?.name) return;
  openShare(item.name, `${item.name}｜${item.location}｜非遗体验`);
  showToast({ type: 'share', message: `正在分享 ${item.name}` });
};

const onToggleFavorite = (item: any): void => {
  if (!item?.id) return;
  const wasFav = isExperienceFavorite(item.id, props.provinceId, 'craft');
  toggleExperienceFavorite(item.id, props.provinceId, 'craft');
  showToast({ type: 'info', message: wasFav ? `已取消收藏 ${item.name}` : `已收藏 ${item.name}` });
};
 
const onToggleBeen = (item: any): void => {
  if (!item?.id) return;
  const wasBeen = isExperienceBeen(item.id, props.provinceId, 'craft');
  toggleExperienceBeen(item.id, props.provinceId, 'craft');
  showToast({ type: 'success', message: wasBeen ? `已取消体验 ${item.name}` : `已体验 ${item.name}` });
};

const props = defineProps<{
  items: any[];
  provinceId: string;
}>();

const activeIndex = ref(0);

const currentItem = computed(() => props.items?.[activeIndex.value] || null);

watch(() => props.items, (newItems) => {
  if (activeIndex.value >= (newItems?.length || 0)) {
    activeIndex.value = 0;
  }
});

const heritageLabel: Record<string, string> = {
  national: '国家级非遗',
  provincial: '省级非遗',
  municipal: '市级非遗',
};

const heritageShort: Record<string, string> = {
  national: '国家级',
  provincial: '省级',
  municipal: '市级',
};
</script>

<style scoped src="./index.scss" lang="scss" />
