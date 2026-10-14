<template>
  <section class="outdoor-adventure">
    <div class="trail-journal">
      <!-- ============================================
           日志本封面（皮质硬壳 + 螺旋装订）
           ============================================ -->
      <div class="journal-cover" v-if="currentItem" :data-level="currentItem.difficulty">
        <!-- 螺旋装订线圈 -->
        <div class="binding-rings">
          <span v-for="r in 8" :key="r" class="binding-ring"></span>
        </div>

        <!-- 日志内页（牛皮纸） -->
        <div class="journal-page">
          <!-- 左侧：贴照片区 -->
          <div class="page-photo">
            <!-- 拍立得照片 -->
            <div class="polaroid">
              <img loading="lazy" :src="currentItem.image" :alt="currentItem.name" class="polaroid-img" />
              <div class="polaroid-caption">{{ currentItem.name }}</div>
              <!-- 胶带角 -->
              <div class="tape tape--tl"></div>
              <div class="tape tape--br"></div>
            </div>

            <!-- 手写页码 -->
            <div class="page-no">
              <span class="no-current">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
              <span class="no-sep">/</span>
              <span class="no-total">{{ String(items.length).padStart(2, '0') }}</span>
            </div>

            <!-- 难度印章 -->
            <div class="diff-stamp" :data-level="currentItem.difficulty">
              <span class="stamp-text">{{ currentItem.difficulty }}</span>
            </div>

            <!-- 评分（手绘） -->
            <div v-if="currentItem.rating" class="rating-sketch">
              <StarIcon class="sketch-star" width="14" height="14" />
              <span class="sketch-val">{{ currentItem.rating }}</span>
              <span v-if="currentItem.reviewCount" class="sketch-count">({{ currentItem.reviewCount }})</span>
            </div>

            <!-- 底部填写表格：距离/时长/路面/适合 -->
            <div class="photo-form">
              <div class="form-field form-field--cyan">
                <RouteIcon class="field-icon" width="18" height="18" />
                <span class="field-label">距离</span>
                <span class="field-val">{{ distanceOf(currentItem, activeIndex) }}<small>km</small></span>
              </div>
              <div class="form-field form-field--green">
                <ClockIcon class="field-icon" width="18" height="18" />
                <span class="field-label">时长</span>
                <span class="field-val">{{ currentItem.duration }}</span>
              </div>
              <div class="form-field form-field--amber">
                <LayersIcon class="field-icon" width="18" height="18" />
                <span class="field-label">路面</span>
                <span class="field-val">{{ surfaceTypeOf(currentItem) }}</span>
              </div>
              <div class="form-field form-field--rose">
                <UsersIcon class="field-icon" width="18" height="18" />
                <span class="field-label">适合</span>
                <span class="field-val">{{ suitableOf(currentItem) }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧：手写信息区 -->
          <div class="page-info">
            <!-- 日期/位置栏 -->
            <div class="meta-bar">
              <span class="meta-type">{{ currentItem.type || '徒步穿越' }}</span>
              <span class="meta-loc">
                <LocationIcon class="meta-loc-icon" width="12" height="12" />
                {{ currentItem.location }}
              </span>
              <button
                class="go-stamp"
                :class="{ 'is-done': isExperienceBeen(currentItem.id, provinceId, 'outdoor') }"
                @click="onToggleBeen(currentItem)"
              >
                <span class="go-text">{{ isExperienceBeen(currentItem.id, provinceId, 'outdoor') ? '已体验' : '出发' }}</span>
                <ChevronRightIcon class="go-arrow" width="14" height="14" />
              </button>
            </div>

            <!-- 路线标题（手写体） -->
            <h4 class="route-title">{{ currentItem.name }}</h4>

            <!-- 描述（手写体） -->
            <p class="route-desc">{{ currentItem.description }}</p>

            <!-- 标签（便签贴纸） -->
            <div class="sticky-tags">
              <span v-for="(tag, ti) in (currentItem.tags || []).slice(0, 3)" :key="ti" class="sticky-tag" :class="`sticky-tag--${ti + 1}`">{{ tag }}</span>
              <span v-if="currentItem.price" class="sticky-tag sticky-tag--price">
                <span class="tag-currency">¥</span>{{ currentItem.price }}起
              </span>
            </div>

            <!-- 路线数据（手写表格栏） -->
            <div class="data-table">
              <div class="data-row data-row--green">
                <span class="data-icon-housing"><TrendUpIcon width="12" height="12" /></span>
                <span class="data-label">累计爬升</span>
                <span class="data-val">{{ totalAscentOf(currentItem, activeIndex) }}<small>m</small></span>
              </div>
              <div class="data-row data-row--cyan">
                <span class="data-icon-housing"><MountainIcon width="12" height="12" /></span>
                <span class="data-label">最高海拔</span>
                <span class="data-val">{{ maxElevationOf(currentItem, activeIndex) }}<small>m</small></span>
              </div>
              <div class="data-row data-row--amber">
                <span class="data-icon-housing"><RefreshIcon width="12" height="12" /></span>
                <span class="data-label">路线类型</span>
                <span class="data-val data-val--text">{{ routeTypeOf(currentItem) }}</span>
              </div>
            </div>

            <!-- 2×2 信息矩阵（手写笔记块） -->
            <div class="note-grid">
              <div class="note-block note-block--access">
                <div class="note-head">
                  <span class="note-icon-housing"><BusIcon width="11" height="11" /></span>
                  <span class="note-label">到达方式</span>
                </div>
                <span class="note-text">{{ accessInfoOf(currentItem, activeIndex) }}</span>
              </div>
              <div class="note-block note-block--season">
                <div class="note-head">
                  <span class="note-icon-housing"><SunIcon width="11" height="11" /></span>
                  <span class="note-label">最佳季节</span>
                </div>
                <span class="note-text note-text--accent">{{ bestMonthsOf(currentItem, activeIndex) }}</span>
              </div>
              <div class="note-block note-block--gear">
                <div class="note-head">
                  <span class="note-icon-housing"><ShoppingBagIcon width="11" height="11" /></span>
                  <span class="note-label">装备建议</span>
                </div>
                <div class="note-list">
                  <span v-for="(g, gi) in gearArrayOf(currentItem, activeIndex)" :key="gi" class="note-pill">{{ g }}</span>
                </div>
              </div>
              <div class="note-block note-block--safety">
                <div class="note-head">
                  <span class="note-icon-housing note-icon-housing--warn"><WarningIcon width="11" height="11" /></span>
                  <span class="note-label note-label--warn">安全提示</span>
                </div>
                <div class="note-list">
                  <span v-for="(t, ti) in safetyArrayOf(currentItem, activeIndex)" :key="ti" class="note-pill note-pill--warn">{{ t }}</span>
                </div>
              </div>
            </div>

            <div class="exp-actions">
              <button
                class="action-btn btn-fav"
                :class="{ 'is-active': isExperienceFavorite(currentItem.id, provinceId, 'outdoor') }"
                @click="onToggleFavorite(currentItem)"
              >
                <BookmarkIcon width="14" height="14" :filled="isExperienceFavorite(currentItem.id, provinceId, 'outdoor')" />
                <span>{{ isExperienceFavorite(currentItem.id, provinceId, 'outdoor') ? '已收藏' : '收藏' }}</span>
              </button>
              <button

                class="action-btn btn-been"
                :class="{ 'is-active': isExperienceBeen(currentItem.id, provinceId, 'outdoor') }"
                @click="onToggleBeen(currentItem)"
              >
                <FlagIcon width="14" height="14" :filled="isExperienceBeen(currentItem.id, provinceId, 'outdoor')" />
                <span>{{ isExperienceBeen(currentItem.id, provinceId, 'outdoor') ? '已体验' : '体验' }}</span>
              </button>
              <button
                class="action-btn btn-share"
                @click="shareExperience(currentItem)"
              >
                <ShareIcon width="14" height="14" />
                <span>分享</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================
           书签导航
           ============================================ -->
      <div class="bookmark-tabs" v-if="items && items.length > 1">
        <button
          v-for="(item, idx) in items"
          :key="item.id || idx"
          class="bookmark"
          :class="{ active: idx === activeIndex }"
          :data-level="item.difficulty"
          @click="activeIndex = idx"
        >
          <div class="bookmark-img-wrap">
            <img loading="lazy" :src="item.image" :alt="item.name" class="bookmark-img" />
          </div>
          <span class="bookmark-no">{{ String(idx + 1).padStart(2, '0') }}</span>
          <span class="bookmark-name">{{ item.name }}</span>
          <span class="bookmark-diff">{{ item.difficulty }}</span>
        </button>
      </div>

      <!-- 空状态 -->
      <div v-if="!items || items.length === 0" class="empty-state">
        <div class="empty-journal-page">
          <div class="empty-binding-edge">
            <span v-for="r in 6" :key="r" class="binding-hole"></span>
          </div>
          <div class="empty-page-content">
            <div class="empty-icon-housing">
              <span class="empty-icon"><MapIcon /></span>
            </div>
            <h4 class="empty-title">路线勘测中</h4>
            <p class="empty-desc">该地区的徒步路线正在规划收录</p>
            <div class="empty-stamp">
              <span class="stamp-ring"></span>
              <span class="stamp-text">勘测</span>
            </div>
            <div class="empty-tags">
              <span class="empty-tag">徒步穿越</span>
              <span class="empty-tag">山地骑行</span>
              <span class="empty-tag">峡谷漂流</span>
              <span class="empty-tag">岩壁攀爬</span>
            </div>
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
  import MapIcon from '../../../../icons/common/MapIcon.vue';
  import StarIcon from '../../../../icons/common/StarIcon.vue';
  import LocationIcon from '../../../../icons/common/LocationIcon.vue';
  import TrendUpIcon from '../../../../icons/pages/scenery/TrendUpIcon.vue';
  import MountainIcon from '../../../../icons/pages/scenery/MountainIcon.vue';
  import RefreshIcon from '../../../../icons/pages/scenery/RefreshIcon.vue';
  import BusIcon from '../../../../icons/pages/scenery/BusIcon.vue';
  import SunIcon from '../../../../icons/common/SunIcon.vue';
  import ShoppingBagIcon from '../../../../icons/common/ShoppingBagIcon.vue';
  import WarningIcon from '../../../../icons/common/WarningIcon.vue';

  import ChevronRightIcon from '../../../../icons/common/ChevronRightIcon.vue';
  import RouteIcon from '../../../../icons/common/RouteIcon.vue';
  import ClockIcon from '../../../../icons/common/ClockIcon.vue';
  import LayersIcon from '../../../../icons/pages/scenery/LayersIcon.vue';
  import UsersIcon from '../../../../icons/pages/scenery/UsersIcon.vue';

  import BookmarkIcon from '../../../../icons/common/BookmarkIcon.vue';
  import HeartIcon from '../../../../icons/common/HeartIcon.vue';
  import FlagIcon from '../../../../icons/common/FlagIcon.vue';
  import ShareIcon from '../../../../icons/common/ShareIcon.vue';

  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useTravelShare } from '../../../TravelShareModal/useTravelShare';
  import TravelShareModal from '../../../TravelShareModal/index.vue';

  const {
    isExperienceFavorite,
    isExperienceWant,
    isExperienceBeen,
    toggleExperienceFavorite,
    toggleExperienceWant,
    toggleExperienceBeen,
  } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const shareExperience = (item: any): void => {
    if (!item?.name) return;
    openShare(item.name, `${item.name}｜${item.location}｜户外探险`);
    showToast({ type: 'share', message: `正在分享 ${item.name}` });
  };

  const props = defineProps<{
    items: any[];
    provinceId: string;
  }>();

  const onToggleFavorite = (item: any): void => {
    if (!item?.id) return;
    const wasFav = isExperienceFavorite(item.id, props.provinceId, 'outdoor');
    toggleExperienceFavorite(item.id, props.provinceId, 'outdoor');
    showToast({ type: 'info', message: wasFav ? `已取消收藏 ${item.name}` : `已收藏 ${item.name}` });
  };
  const onToggleWant = (item: any): void => {
    if (!item?.id) return;
    const wasWant = isExperienceWant(item.id, props.provinceId, 'outdoor');
    toggleExperienceWant(item.id, props.provinceId, 'outdoor');
    showToast({ type: 'want', message: wasWant ? `已移除想去 ${item.name}` : `已加入想去 ${item.name}` });
  };
  const onToggleBeen = (item: any): void => {
    if (!item?.id) return;
    const wasBeen = isExperienceBeen(item.id, props.provinceId, 'outdoor');
    toggleExperienceBeen(item.id, props.provinceId, 'outdoor');
    showToast({ type: 'success', message: wasBeen ? `已取消体验 ${item.name}` : `已体验 ${item.name}` });
  };

  const activeIndex = ref(0);
  const currentItem = computed(() => props.items?.[activeIndex.value]);

  watch(
    () => props.items,
    (newItems) => {
      if (activeIndex.value >= (newItems?.length || 0)) {
        activeIndex.value = 0;
      }
    },
  );

  const distanceOf = (item: any, idx: number) => {
    if (item.distance) return item.distance;
    return (8 + idx * 5 + (idx % 2) * 3).toFixed(1);
  };

  const suitableOf = (item: any) => {
    if (item.suitableFor && item.suitableFor.length) return item.suitableFor.join('·');
    return '户外爱好者';
  };

  const totalAscentOf = (item: any, idx: number) => {
    if (item.totalAscent) return item.totalAscent;
    const base = [1800, 200, 1200, 600, 1500];
    return base[idx % base.length];
  };

  const maxElevationOf = (item: any, idx: number) => {
    if (item.maxElevation) return item.maxElevation;
    const base = [1860, 200, 1500, 800, 2200];
    return base[idx % base.length];
  };

  const routeTypeOf = (item: any) => item.routeType || '折返';

  const surfaceTypeOf = (item: any) => item.surfaceType || '混合';

  const accessInfoOf = (item: any, idx: number) => {
    if (item.accessInfo) return item.accessInfo;
    const defaults = [
      '自驾至景区停车场，换乘景区巴士',
      '自驾至码头，乘竹筏出发',
      '高铁至最近站，转大巴前往',
      '包车前往起点，终点接驳返回',
    ];
    return defaults[idx % defaults.length];
  };

  const bestMonthsOf = (item: any, idx: number) => {
    if (item.bestMonths) return item.bestMonths;
    const defaults = ['4-5月·9-10月', '4-10月', '3-5月·9-11月', '6-8月', '全年'];
    return defaults[idx % defaults.length];
  };

  const gearListItem = (val: string) => val.trim();

  const gearArrayOf = (item: any, idx: number) => {
    if (item.gearList && item.gearList.length) return item.gearList.map(gearListItem);
    const defaults = [
      '登山杖·护膝·雨衣·保暖衣物',
      '防晒·救生衣·防水袋',
      '登山杖·头灯·能量补给',
      '徒步鞋·背包·充足饮水',
    ];
    return defaults[idx % defaults.length].split('·').map(gearListItem);
  };

  const safetyArrayOf = (item: any, idx: number) => {
    if (item.safetyTips && item.safetyTips.length) return item.safetyTips.map(gearListItem);
    const defaults = [
      '山顶温差大·雨后路滑·提前预约',
      '穿戴救生衣·听从船工指挥',
      '结伴同行·勿走未开发路线',
      '注意防晒·携带充足饮水',
    ];
    return defaults[idx % defaults.length].split('·').map(gearListItem);
  };
</script>

<style scoped src="./index.scss" lang="scss" />
