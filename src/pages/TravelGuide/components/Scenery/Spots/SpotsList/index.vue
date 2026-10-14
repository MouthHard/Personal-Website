<template>
  <div class="spots-wrapper">
    <div v-if="spots.length > 0" class="spots-container">
      <div
        v-for="spot in spots"
        :key="spot.id"
        class="spot-card"
        @click="emit('open-detail', spot.id)"
      >
        <!-- 卡片四角铆钉 -->
        <span class="rivet rivet-tl"></span>
        <span class="rivet rivet-tr"></span>
        <span class="rivet rivet-bl"></span>
        <span class="rivet rivet-br"></span>

        <div class="spot-image-wrapper">
          <img loading="lazy" :src="spot.image" :alt="spot.name" class="spot-image" />

          <div class="main-landscape-types">
            <div
              v-for="category in spot.landscapeCategory || ['自然景观']"
              :key="category"
              class="main-landscape-type"
            >
              {{ category }}
            </div>
          </div>

          <div class="spot-rating">
            <span class="rating-icon"><StarIcon width="14" height="14" /></span>
            <span class="rating-value">{{ spot.rating || 4.5 }}</span>
            <span v-if="spot.reviewCount" class="review-count">{{ spot.reviewCount }}</span>
          </div>

          <div class="spot-ticket-badge">
            <span class="ticket-label">门票</span>
            <span class="ticket-value">{{ spot.ticketPrice }}</span>
          </div>

          <div class="sub-landscape-types">
            <span
              v-for="tag in spot.landformTags"
              :key="tag"
              class="landscape-type-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="spot-content">
          <div class="spot-header">
            <div class="spot-name-wrapper">
              <h3 class="spot-name" v-html="highlightedName(spot.name)"></h3>
              <span v-if="spot.rankBadge" class="rank-badge">{{ spot.rankBadge }}</span>
            </div>

          </div>

          <p v-if="spot.highlight" class="spot-highlight">{{ spot.highlight }}</p>


          <div class="spot-meta">
            <div class="meta-item">
              <LocationIcon width="13" height="13" />
              <span>{{ spot.location }}</span>
            </div>
            <div v-if="spot.distance" class="meta-item">
              <MapIcon width="13" height="13" />
              <span>{{ spot.distance }}</span>
            </div>
          </div>


          <div class="spot-tags">
            <span
              v-for="(tag, index) in spot.tags.slice(0, 3)"
              :key="index"
              class="tag-item"
              :class="`tag-${(index as number) % 3}`"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 底部操作栏：玻璃珠按钮组 -->
          <div class="card-action-bar">
            <div class="action-group">
              <button
                class="bead-btn bead-like"
                :class="{ active: isSpotLike(spot.id) }"
                @click.stop="emit('toggle-like', spot.id)"
              >
                <ThumbUpIcon width="15" height="15" :filled="isSpotLike(spot.id)" />
                <span>点赞</span>
              </button>
              <button
                class="bead-btn bead-want"
                :class="{ active: isSpotWant(spot.id) }"
                @click.stop="emit('toggle-want', spot.id)"
              >
                <HeartIcon width="15" height="15" :filled="isSpotWant(spot.id)" />
                <span>想去</span>
              </button>
              <button class="bead-btn bead-share" @click.stop="emit('share', spot.id)">
                <LinkIcon width="15" height="15" />
                <span>分享</span>
              </button>
              <button
                class="bead-btn bead-been"
                :class="{ active: isSpotBeen(spot.id) }"
                @click.stop="emit('toggle-been', spot.id)"
              >
                <FlagIcon width="15" height="15" :filled="isSpotBeen(spot.id)" />
                <span>去过</span>
              </button>
              <button class="bead-btn bead-nav" @click.stop="emit('navigate', spot.id)">
                <MapIcon width="15" height="15" />
                <span>导航</span>
              </button>
              <button class="bead-btn bead-detail" @click.stop="emit('open-detail', spot.id)">
                <ChevronRightIcon width="15" height="15" />
                <span>详情</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-rivet empty-rivet-tl"></span>
      <span class="empty-rivet empty-rivet-tr"></span>
      <span class="empty-rivet empty-rivet-bl"></span>
      <span class="empty-rivet empty-rivet-br"></span>


      <div class="empty-radar">
        <div class="radar-grid"></div>
        <div class="radar-ring radar-ring-outer"></div>
        <div class="radar-ring radar-ring-mid"></div>
        <div class="radar-ring radar-ring-inner"></div>
        <div class="radar-sweep"></div>
        <div class="radar-cross-h"></div>
        <div class="radar-cross-v"></div>
        <div class="radar-center"></div>
        <div class="radar-tick radar-tick-n"></div>
        <div class="radar-tick radar-tick-e"></div>
        <div class="radar-tick radar-tick-s"></div>
        <div class="radar-tick radar-tick-w"></div>
        <span class="radar-label radar-label-n">N</span>
        <span class="radar-label radar-label-e">E</span>
        <span class="radar-label radar-label-s">S</span>
        <span class="radar-label radar-label-w">W</span>
        <div class="radar-outer-ring"></div>
      </div>

      <div class="empty-status-tag">
        <span class="status-tag-dot"></span>
        <span class="status-tag-text">无目标锁定</span>
        <span class="status-tag-dot"></span>
      </div>

      <div class="empty-status-lights">
        <span class="status-light light-off"></span>
        <span class="status-light light-off"></span>
        <span class="status-light light-warn"></span>
        <span class="status-light light-off"></span>
      </div>

      <div class="empty-text-block">
        <h3 class="empty-title">未找到符合条件的景点</h3>
        <p class="empty-desc">尝试调整筛选条件或搜索关键词</p>
      </div>

      <button class="reset-btn" @click="emit('reset')">
        <span class="reset-btn-rivet reset-btn-rivet-l"></span>
        <span class="reset-btn-rivet reset-btn-rivet-r"></span>
        <span class="reset-btn-decor reset-btn-decor-l"></span>
        <span class="reset-btn-decor reset-btn-decor-r"></span>
        <span class="reset-btn-text">重置筛选</span>
        <span class="reset-btn-glow"></span>
      </button>

      <div class="empty-gauge">
        <span class="gauge-label">0</span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick gauge-tick-mid"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-tick"></span>
        <span class="gauge-label">100</span>
      </div>

      <span class="empty-particle empty-particle-1"></span>
      <span class="empty-particle empty-particle-2"></span>
      <span class="empty-particle empty-particle-3"></span>
      <span class="empty-particle empty-particle-4"></span>
      <span class="empty-particle empty-particle-5"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LocationIcon from '../../../../icons/common/LocationIcon.vue';
  import HeartIcon from '../../../../icons/common/HeartIcon.vue';
  import StarIcon from '../../../../icons/common/StarIcon.vue';
  import ThumbUpIcon from '../../../../icons/common/ThumbUpIcon.vue';
  import MapIcon from '../../../../icons/common/MapIcon.vue';

  import FlagIcon from '../../../../icons/common/FlagIcon.vue';

  import LinkIcon from '../../../../icons/common/LinkIcon.vue';
  import ChevronRightIcon from '../../../../icons/common/ChevronRightIcon.vue';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';

  const props = defineProps<{
    spots: ScenerySpot[];
    highlightKeyword?: string;
  }>();

  const emit = defineEmits<{
    'open-detail': [spotId: string];
    'toggle-favorite': [spotId: string];
    'toggle-like': [spotId: string];
    'toggle-want': [spotId: string];
    'toggle-been': [spotId: string];
    navigate: [spotId: string];

    share: [spotId: string];
    reset: [];
  }>();

  const { isSpotLike, isSpotWant, isSpotBeen } = useSceneryPrefs();

  const highlightedName = (name: string): string => {
    const kw = props.highlightKeyword;
    if (!kw) return name;
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return name.replace(regex, '<mark class="search-highlight">$1</mark>');
  };
</script>

<style scoped src="./index.scss" lang="scss" />
