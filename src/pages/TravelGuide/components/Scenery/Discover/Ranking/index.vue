<template>
  <div class="discover-ranking">
    <section class="ranking-board">
      <div class="board-top-row">
        <header class="board-header">
          <h3 class="board-title">
            <span class="title-icon"><StarIcon /></span>
            必打卡榜单
          </h3>
          <p class="board-subtitle">综合评分与人气排名，游客必去打卡地</p>
        </header>

        <div class="sort-bar">
          <button
            v-for="opt in sortOptions"
            :key="opt.key"
            class="sort-btn"
            :class="{ active: sortKey === opt.key }"
            @click="sortKey = opt.key"
          >

            <SortActiveIndicator v-if="sortKey === opt.key" />
            <span class="sort-label">{{ opt.label }}</span>
          </button>
        </div>
      </div>

      <ol v-if="rankingSpots.length > 0" class="ranking-list">
        <li
          v-for="(spot, index) in rankingSpots"
          :key="spot.id"
          class="ranking-item"
          :class="{
            'is-top': index < 3,
            'rank-gold': index === 0,
            'rank-silver': index === 1,
            'rank-bronze': index === 2,
            checked: isSpotBeen(spot.id),
          }"
          @click="$emit('navigate-to-spot', spot.name)"
        >
          <CheckedHoloIcon v-if="isSpotBeen(spot.id)" />

          <div class="rank-badge">
            <span class="badge-ring"></span>
            <span class="badge-num">{{ index + 1 }}</span>
          </div>

          <div class="rank-cover">
            <img
              :src="spot.image"
              :alt="spot.name"
              class="cover-img"
              loading="lazy"
            />
            <div class="cover-frame"></div>
            <div class="cover-glow"></div>
          </div>

          <div class="rank-info">
            <div class="info-head">
              <span class="rank-name">{{ spot.name }}</span>
              <span v-if="spot.rankBadge" class="rank-tag">{{ spot.rankBadge }}</span>
              <span v-if="isSpotBeen(spot.id)" class="checked-stamp">已打卡</span>
            </div>
            <div class="rank-highlight">{{ spot.highlight || spot.description }}</div>
            <div class="rank-tags">
              <span v-if="spot.level" class="tag-level">{{ spot.level }}</span>
              <span
                v-for="t in (spot.tags || []).slice(0, 3)"
                :key="t"
                class="tag-item"
              >
                {{ t }}
              </span>
              <span v-if="spot.bestTime" class="tag-time">{{ spot.bestTime }}</span>
            </div>
          </div>

          <div class="rank-stats">
            <div class="stat-reputation">
              <div class="stat-rating">
                <span class="rating-value">{{ (spot.rating || 4.5).toFixed(1) }}</span>
                <span class="rating-star"><StarIcon :size="18" /></span>
              </div>
              <span v-if="spot.reviewCount" class="meta-reviews">{{ spot.reviewCount }}</span>
            </div>
            <div class="stat-decision">
              <span v-if="spot.ticketPrice" class="meta-price">{{ spot.ticketPrice }}</span>
              <span v-if="spot.distance" class="meta-dist">{{ spot.distance }}</span>
            </div>
          </div>

          <div class="rank-actions">
            <button
              class="rank-btn rank-like"
              :class="{ active: isSpotLike(spot.id) }"
              aria-label="点赞景点"
              @click.stop="handleToggleLike(spot.id)"
            >
              <ThumbUpIcon class="btn-icon" :filled="isSpotLike(spot.id)" :size="16" />
            </button>
            <button
              class="rank-btn rank-want"
              :class="{ active: isSpotWant(spot.id) }"
              aria-label="想去景点"
              @click.stop="handleToggleWant(spot.id)"
            >
              <HeartIcon class="btn-icon" :filled="isSpotWant(spot.id)" :size="16" />
            </button>
            <button
              class="rank-btn rank-share"
              aria-label="分享景点"
              @click.stop="handleShare(spot)"
            >
              <ShareIcon class="btn-icon" :size="16" />
            </button>
            <button
              class="rank-btn rank-been"
              :class="{ active: isSpotBeen(spot.id) }"
              aria-label="去过景点"
              @click.stop="handleToggleBeen(spot.id)"
            >
              <FlagIcon class="btn-icon" :filled="isSpotBeen(spot.id)" :size="16" />
            </button>
          </div>
        </li>
      </ol>
      <div v-else class="ranking-empty">
        <StarIcon class="empty-icon" />
        <p class="empty-text">暂无榜单数据</p>
      </div>
    </section>

    <TravelShareModal
      :visible="shareVisible"
      :title="shareTitle"
      :share-text="shareText"
      :share-url="shareUrl"
      @close="closeShare"
    />
  </div>
</template>

<script setup lang="ts">
  import type { SceneryData, ScenerySpot } from '@/typesOfPages/travelGuide';
  import { computed, ref } from 'vue';
  import { CheckedHoloIcon } from '@/pages/TravelGuide/icons/pages/scenery';
  import { SortActiveIndicator } from '@/pages/TravelGuide/icons/pages/scenery';
  import { StarIcon, HeartIcon, ShareIcon, ThumbUpIcon, FlagIcon } from '@/pages/TravelGuide/icons/common';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';

  const props = defineProps<{
    sceneryData: SceneryData | null;
    loading: boolean;
  }>();

  defineEmits<{
    (e: 'navigate-to-spot', spotName: string): void;
  }>();

  const { show: showToast } = useTravelToast();
  const { isSpotLike, toggleSpotLike, isSpotWant, toggleSpotWant, isSpotBeen, toggleSpotBeen } = useSceneryPrefs();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();


  type SortKey = 'comprehensive' | 'popular' | 'nearby';
  const sortKey = ref<SortKey>('comprehensive');
  const sortOptions: Array<{ key: SortKey; label: string }> = [
    { key: 'comprehensive', label: '综合' },
    { key: 'popular', label: '人气高' },
    { key: 'nearby', label: '距离近' },
  ];

  const handleToggleLike = (id: string) => {
    const wasLike = isSpotLike(id);
    toggleSpotLike(id);
    const spot = rankingSpots.value.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasLike ? `已取消点赞 ${name}` : `已点赞 ${name}` });
  };

  const handleToggleWant = (id: string) => {
    const wasWant = isSpotWant(id);
    toggleSpotWant(id);
    const spot = rankingSpots.value.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasWant ? `已移出想去清单 ${name}` : `已加入想去清单 ${name}` });
  };

  const handleToggleBeen = (id: string) => {
    const wasBeen = isSpotBeen(id);
    toggleSpotBeen(id);
    const spot = rankingSpots.value.find((s) => s.id === id);
    const name = spot?.name ?? id;
    showToast({ type: 'success', message: wasBeen ? `已取消 ${name} 去过标记` : `已标记 ${name} 为去过` });
  };

  const handleShare = (spot: ScenerySpot) => {
    openShare(
      spot.name,
      `${spot.name}｜${spot.location}｜评分 ${spot.rating ?? 4.5}｜门票 ${spot.ticketPrice || '免费'}`,
    );
  };

  const parseReviewCount = (s?: string): number => {
    if (!s) return 0;
    const m = s.match(/([\d,]+)/);
    return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
  };

  const parseDistance = (s?: string): number => {
    if (!s) return 9999;
    const m = s.match(/([\d.]+)\s*km/);
    return m ? parseFloat(m[1]) : 9999;
  };

  const rankingSpots = computed<ScenerySpot[]>(() => {
    if (!props.sceneryData?.spots) return [];
    const arr = [...props.sceneryData.spots];
    if (sortKey.value === 'popular') {
      arr.sort(
        (a, b) => parseReviewCount(b.reviewCount) - parseReviewCount(a.reviewCount),
      );
    } else if (sortKey.value === 'nearby') {
      arr.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
    } else {
      arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return arr.slice(0, 8);
  });
</script>

<style scoped src="./index.scss" lang="scss" />
