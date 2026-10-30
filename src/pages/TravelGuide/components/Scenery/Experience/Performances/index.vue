<template>
  <section class="performances">
    <div class="ticket-ambient"></div>

    <div v-if="items && items.length > 0" class="ticket-stack">
      <article v-for="(item, idx) in items" :key="item.id || idx" class="ticket-item"
        :class="{ expanded: activeIndex === idx }">
        <!-- ============================================
             折叠态条头（点击展开）
             ============================================ -->
        <header class="ticket-stub" @click="toggle(idx)">
          <div class="stub-thumb">
            <img loading="lazy" :src="item.image" :alt="item.name" />
          </div>
          <div class="stub-perf perf-left">
            <span v-for="h in 4" :key="h" class="perf-hole"></span>
          </div>

          <div class="stub-main">
            <div class="stub-no">
              <span class="no-label">No.</span>
              <span class="no-value">{{ pad(idx + 1) }}</span>
            </div>
            <h4 class="stub-title">{{ item.name }}</h4>
            <div class="stub-meta">
              <span class="meta-chip chip-type">{{ item.type }}</span>
              <span class="meta-dot"></span>
              <span class="meta-text">{{ item.duration }}</span>
              <span class="meta-dot"></span>
              <span class="meta-text">{{ item.location }}</span>
            </div>
            <div v-if="item.heritageLevel" class="stub-seal">
              <span class="seal-ring"></span>
              <span class="seal-text">{{ heritageLabel[item.heritageLevel] || '非遗' }}</span>
            </div>
          </div>

          <div class="stub-actions">
            <button class="stub-act act-fav"
              :class="{ 'is-active': isExperienceFavorite(item.id, provinceId, 'performance') }"
              :title="isExperienceFavorite(item.id, provinceId, 'performance') ? '已收藏' : '收藏'"
              @click.stop="onToggleFavorite(item)">
              <BookmarkIcon :size="17" :filled="isExperienceFavorite(item.id, provinceId, 'performance')" />
            </button>
            <button class="stub-act act-been"
              :class="{ 'is-active': isExperienceBeen(item.id, provinceId, 'performance') }"
              :title="isExperienceBeen(item.id, provinceId, 'performance') ? '已体验' : '标记体验'"
              @click.stop="onToggleBeen(item)">
              <FlagIcon :size="17" :filled="isExperienceBeen(item.id, provinceId, 'performance')" />
            </button>
            <button class="stub-act act-share" title="分享" @click.stop="sharePerformance(item)">
              <ShareIcon :size="17" />
            </button>
          </div>

          <div class="stub-price">
            <span class="price-currency">¥</span>
            <span class="price-amount">{{ item.price || '—' }}</span>
          </div>

          <div class="stub-perf perf-right">
            <span v-for="h in 4" :key="h" class="perf-hole"></span>
          </div>

          <div class="stub-toggle">
            <span class="toggle-icon"></span>
            <span class="toggle-label">{{ activeIndex === idx ? '收起' : '展开' }}</span>
          </div>
        </header>

        <!-- ============================================
             展开态：左右分区戏票（左主票 + 中齿孔撕边 + 右副券）
             左主票=内容/观赏价值  右副券=票务/场次存根
             每个信息只出现一次，不重复
             ============================================ -->
        <div class="ticket-expand">
          <div class="ticket-body">
            <div class="corner-deco corner-tl"></div>
            <div class="corner-deco corner-tr"></div>
            <div class="corner-deco corner-bl"></div>
            <div class="corner-deco corner-br"></div>
            <!-- 左主票（内容/观赏价值） -->
            <div class="main-stub">
              <div class="ticket-watermark">
                <span class="watermark-text">{{ item.heritageLevel ? '非遗' : '戏票' }}</span>
              </div>
              <div class="main-poster">
                <img loading="lazy" :src="item.image" :alt="item.name" class="poster-image" />
                <div class="poster-glow"></div>
                <div class="poster-frame"></div>
                <div v-if="item.rating" class="poster-rating">
                  <StarIcon class="rating-icon" width="13" height="13" />
                  <span class="rating-num">{{ item.rating }}</span>
                  <span v-if="item.reviewCount" class="rating-count">({{ item.reviewCount }})</span>
                </div>
              </div>

              <div class="main-content">
                <div class="content-head">

                  <h3 class="head-title">{{ item.name }}</h3>
                </div>

                <p class="content-desc">{{ item.description }}</p>

                <div v-if="item.tags && item.tags.length" class="content-tags">
                  <span v-for="(tag, ti) in item.tags.slice(0, 5)" :key="ti" class="tag-chip"
                    :class="{ 'tag-heritage': tag.includes('非遗') || tag.includes('传承') }">{{ tag }}</span>
                </div>

                <div v-if="item.highlights && item.highlights.length" class="content-highlights">
                  <div class="highlights-head">
                    <SparklesIcon class="highlights-icon" width="15" height="15" />
                    <span class="highlights-label">剧目看点</span>
                  </div>
                  <ul class="highlights-list">
                    <li v-for="(h, hi) in item.highlights.slice(0, 4)" :key="hi" class="highlight-item">
                      <span class="highlight-mark"></span>
                      <span class="highlight-text">{{ h }}</span>
                    </li>
                  </ul>
                </div>

                <div v-if="item.suitableFor && item.suitableFor.length" class="content-suitable">
                  <span class="suitable-label">适宜人群</span>
                  <div class="suitable-tags">
                    <span v-for="(s, si) in item.suitableFor.slice(0, 4)" :key="si" class="suitable-tag">{{ s }}</span>
                  </div>
                </div>

                <div class="content-action">
                  <button class="action-btn btn-fav"
                    :class="{ 'is-active': isExperienceFavorite(item.id, provinceId, 'performance') }"
                    @click="onToggleFavorite(item)">
                    <span class="btn-stamp">
                      <BookmarkIcon :size="14" :filled="isExperienceFavorite(item.id, provinceId, 'performance')" />
                    </span>
                    <span class="btn-perf"></span>
                    <span
                      class="btn-text">{{ isExperienceFavorite(item.id, provinceId, 'performance') ? '已收藏' : '收藏' }}</span>
                  </button>

                  <button class="action-btn btn-been"
                    :class="{ 'is-active': isExperienceBeen(item.id, provinceId, 'performance') }"
                    @click="onToggleBeen(item)">
                    <span class="btn-stamp">
                      <FlagIcon :size="14" :filled="isExperienceBeen(item.id, provinceId, 'performance')" />
                    </span>
                    <span class="btn-perf"></span>
                    <span
                      class="btn-text">{{ isExperienceBeen(item.id, provinceId, 'performance') ? '已体验' : '体验' }}</span>
                  </button>

                  <button class="action-btn btn-share" @click="sharePerformance(item)">
                    <span class="btn-stamp">
                      <ShareIcon :size="14" />
                    </span>
                    <span class="btn-perf"></span>
                    <span class="btn-text">分享</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 中间垂直齿孔撕边 -->
            <div class="perf-divider">
              <span v-for="h in 16" :key="h" class="divider-hole"></span>
            </div>

            <!-- 右副券（票务/场次存根） -->
            <div class="side-stub">
              <div class="side-header">
                <span class="side-title">副券</span>
                <span class="side-no">{{ pad(idx + 1) }}</span>
              </div>


              <div class="side-price-box">
                <span class="side-price-label">票价</span>
                <span class="side-price-value">
                  <span class="side-currency">¥</span>{{ item.price || '—' }}
                </span>
              </div>

              <div class="side-venue-box">
                <LocationIcon class="side-venue-icon" width="13" height="13" />
                <span class="side-venue-text">{{ item.location }}</span>
              </div>

              <div class="side-duration-box">
                <ClockIcon class="side-dur-icon" width="13" height="13" />
                <span class="side-dur-text">{{ item.duration }}</span>
              </div>

              <div class="side-info-row">
                <span class="side-info-label">场次</span>
                <span class="side-info-value">{{ showSession(idx) }}</span>
              </div>
              <div class="side-info-row">
                <span class="side-info-label">座席</span>
                <span class="side-info-value">{{ seatLabel(idx) }}</span>
              </div>
              <div class="side-info-row">
                <span class="side-info-label">日期</span>
                <span class="side-info-value">{{ showDate(idx) }}</span>
              </div>

              <div class="side-barcode">
                <div class="barcode-bars">
                  <span v-for="b in 28" :key="b" class="bar"
                    :style="{ width: barWidth(b, idx) + 'px', opacity: barOpacity(b, idx) }"></span>
                </div>
              </div>

              <div class="holo-strip"></div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- ============================================
         空状态
         ============================================ -->
    <div v-else class="empty-ticket">
      <div class="empty-curtain empty-curtain--left"></div>
      <div class="empty-curtain empty-curtain--right"></div>
      <div class="empty-stage">
        <div class="empty-stub">
          <div class="stub-perf perf-left">
            <span v-for="h in 4" :key="h" class="perf-hole"></span>
          </div>
          <div class="empty-stub-main">
            <div class="empty-icon-housing">
              <TheaterMasksIcon class="empty-icon" width="40" height="40" />
            </div>
            <h4 class="empty-title">票务待放票</h4>
            <p class="empty-desc">该地区剧目票务正在排期中</p>
            <div class="empty-show-tags">
              <span class="show-tag">戏曲</span>
              <span class="show-tag">话剧</span>
              <span class="show-tag">歌舞</span>
              <span class="show-tag">民乐</span>
            </div>
          </div>
          <div class="stub-perf perf-right">
            <span v-for="h in 4" :key="h" class="perf-hole"></span>
          </div>
        </div>
        <div class="empty-marquee">
          <span class="marquee-text">敬请期待精彩上演 · 好戏即将开场 · 敬请期待精彩上演 · 好戏即将开场</span>
        </div>
      </div>
    </div>

    <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl"
      @close="closeShare" />
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import TheaterMasksIcon from '../../../../icons/pages/scenery/TheaterMasksIcon.vue';
import ClockIcon from '../../../../icons/common/ClockIcon.vue';
import LocationIcon from '../../../../icons/common/LocationIcon.vue';
import StarIcon from '../../../../icons/common/StarIcon.vue';
import SparklesIcon from '../../../../icons/common/SparklesIcon.vue';
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

const sharePerformance = (item: any): void => {
  if (!item?.name) return;
  openShare(item.name, `${item.name}｜${item.location}｜演艺观赏`);
  showToast({ type: 'share', message: `正在分享 ${item.name}` });
};

const props = defineProps<{
  items: any[];
  provinceId: string;
}>();

const onToggleFavorite = (item: any): void => {
  if (!item?.id) return;
  const wasFav = isExperienceFavorite(item.id, props.provinceId, 'performance');
  toggleExperienceFavorite(item.id, props.provinceId, 'performance');
  showToast({ type: 'info', message: wasFav ? `已取消收藏 ${item.name}` : `已收藏 ${item.name}` });
};

const onToggleBeen = (item: any): void => {
  if (!item?.id) return;
  const wasBeen = isExperienceBeen(item.id, props.provinceId, 'performance');
  toggleExperienceBeen(item.id, props.provinceId, 'performance');
  showToast({ type: 'success', message: wasBeen ? `已取消体验 ${item.name}` : `已体验 ${item.name}` });
};

const activeIndex = ref<number | null>(0);

watch(
  () => props.items,
  (newItems) => {
    if (activeIndex.value !== null && activeIndex.value >= (newItems?.length || 0)) {
      activeIndex.value = 0;
    }
  },
);

const heritageLabel: Record<string, string> = {
  national: '国家级非遗',
  provincial: '省级非遗',
  municipal: '市级非遗',
};

const pad = (n: number) => String(n).padStart(2, '0');


const barWidth = (b: number, idx: number) => {
  const seed = (b * 7 + idx * 3) % 5;
  return seed === 0 ? 1 : seed === 1 ? 2 : seed === 2 ? 1 : seed === 3 ? 3 : 2;
};

const barOpacity = (b: number, idx: number) => {
  return ((b + idx) % 3 === 0) ? 0.4 : 1;
};

const toggle = (idx: number) => {
  activeIndex.value = activeIndex.value === idx ? null : idx;
};

const seatLabel = (idx: number) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const row = rows[idx % rows.length];
  const num = ((idx * 7) % 20) + 1;
  return `${row}排${num}座`;
};

const showDate = (idx: number) => {
  const month = ((idx * 3) % 12) + 1;
  const day = ((idx * 5) % 28) + 1;
  return `2026.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
};

const showSession = (idx: number) => {
  const sessions = ['19:30', '14:00', '19:30', '15:30', '20:00'];
  return `${sessions[idx % sessions.length]} 场`;
};
</script>

<style scoped src="./index.scss" lang="scss" />
