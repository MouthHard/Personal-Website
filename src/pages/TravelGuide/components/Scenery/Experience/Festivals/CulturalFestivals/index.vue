<template>
  <section class="cultural-festivals">
    <div class="desk-calendar">

      <div class="binding-spine">
        <span
          v-for="ring in bindingRings"
          :key="ring.id"
          class="binding-ring"
          :style="{ left: `calc(${ring.pos}% - 9px)` }"
        ></span>
      </div>

      <div class="cover-header">
        <div class="cover-title-row">
          <span class="cover-ornament"><LeafIcon /></span>
          <h4 class="cover-title">{{ currentYear }} 节庆月历</h4>
          <span class="cover-ornament"><CalendarIcon /></span>
        </div>
        <p class="cover-subtitle">十二个月特色节庆一览 · 共 {{ totalFestivalCount }} 个节庆</p>
      </div>

      <div v-if="totalFestivalCount === 0" class="empty-state">
        <span class="empty-icon"><GalaxyIcon /></span>
        <h5 class="empty-title">暂无节庆数据</h5>
        <p class="empty-desc">该地区的特色节庆活动正在收录中</p>
      </div>

      <template v-else>
        <div class="calendar-pages">
          <div
            v-for="month in monthsList"
            :key="month.value"
            class="page"
            :class="[
              `season-${month.season}`,
              { 'has-festivals': month.festivals.length > 0,
                'is-current': month.isCurrent,
                'is-active': selectedMonth === month.value },
            ]"
            @click="month.festivals.length > 0 && selectMonth(month.value)"
          >
            <span class="punch-hole hole-left"></span>
            <span class="punch-hole hole-right"></span>
            <span class="page-fold"></span>

            <div class="page-head">
              <span class="page-season-tag">{{ month.seasonName }}</span>
              <span class="page-month-num">{{ month.label }}</span>
              <span v-if="month.festivals.length > 0" class="page-count-chip">
                {{ month.festivals.length }}
              </span>
            </div>

            <div class="page-body">
              <div v-if="month.festivals.length > 0" class="stickers">
                <div
                  v-for="(festival, idx) in month.festivals.slice(0, 2)"
                  :key="festival.id"
                  class="sticker"
                  :class="[
                    festival.isUnique ? 'stamp-red' : 'note-blue',
                    `tilt-${(idx % 3) + 1}`,
                  ]"
                >
                  <span class="sticker-tape"></span>
                  <span class="sticker-date">{{ festival.day }}</span>
                  <span class="sticker-name">{{ festival.name }}</span>
                  <span class="sticker-type-mark">
                    {{ festival.isUnique ? '特' : '传' }}
                  </span>
                </div>
                <div v-if="month.festivals.length > 2" class="more-chip">
                  +{{ month.festivals.length - 2 }} 更多
                </div>
                <div class="page-cta">
                  <span>查看详情</span>
                  <span class="cta-arrow"><ChevronRightIcon /></span>
                </div>
              </div>

              <div v-else class="blank-page">
                <div class="blank-grid"></div>
                <span class="blank-text">暂无</span>
              </div>
            </div>
          </div>
        </div>

        <Teleport to="body">
          <Transition name="postcard-modal">
            <div
              v-if="selectedMonthData"
              class="postcard-modal-mask"
              @click.self="closePanel"
            >
              <div class="postcard-modal-wrap">
                <div class="greeting-card" :key="selectedMonth ?? 0">

                  <button class="modal-close-btn" @click="closePanel" aria-label="关闭">
                    <CloseIcon />
                  </button>

                  <!-- 左侧面板（上下布局：月份信息 + 节日列表） -->
                  <div class="card-left">
                    <!-- 上区：月份封面信息 -->
                    <div class="cover-info">
                      <div class="cover-deco-top">
                        <span class="cover-line"></span>
                        <span class="cover-ornament-s"><LeafIcon /></span>
                        <span class="cover-line"></span>
                      </div>
                      <div class="cover-info-row">
                        <div class="cover-month-big">{{ selectedMonthData.label }}</div>
                        <div class="cover-season-line">
                          {{ selectedMonthData.seasonName }}季 · {{ currentYear }}年
                        </div>
                      </div>
                      <div class="cover-info-bottom">
                        <div class="cover-stamp">
                          <div class="stamp-perforated">
                            <span class="stamp-icon"><CalendarIcon /></span>
                            <span class="stamp-text">节庆</span>
                          </div>
                        </div>
                        <div class="cover-wax-seal">
                          <span class="wax-text">庆</span>
                        </div>
                        <div class="cover-title-bottom">
                          <h5 class="cover-title-text">节庆月历</h5>
                          <span class="cover-count-text">共 {{ selectedMonthData.festivals.length }} 个节庆</span>
                        </div>
                      </div>
                    </div>

                    <!-- 下区：节日列表 -->
                    <div class="card-list">


                      <div class="inner-head">
                        <span class="inner-head-icon"><CalendarIcon /></span>
                        <h5 class="inner-title">本月节庆</h5>
                        <span class="inner-count-chip">
                          {{ pageFestivals.length }} / {{ selectedMonthData.festivals.length }}
                        </span>
                      </div>

                      <div class="inner-list">
                        <div
                          v-for="festival in pageFestivals"
                          :key="festival.id"
                          class="festival-item"
                          :class="[
                            festival.isUnique ? 'is-unique' : 'is-traditional',
                            { 'is-selected': selectedFestival?.id === festival.id },
                          ]"
                          @click="selectFestival(festival)"
                        >
                          <div class="item-date-stamp">
                            <span class="item-day">{{ festival.day }}</span>
                          </div>
                          <div class="item-content">
                            <div class="item-title-row">
                              <h6 class="item-name">{{ festival.name }}</h6>
                              <span class="item-badge">
                                {{ festival.isUnique ? '特色' : '传统' }}
                              </span>
                            </div>
                            <p class="item-desc">{{ festival.description }}</p>
                            <div class="item-loc">
                              <LocationIcon /><span>{{ festival.location }}</span>
                            </div>
                          </div>
                          <div class="item-actions" @click.stop>
                            <button
                              class="action-btn btn-fav"
                              :class="{ 'is-active': isExperienceFavorite(festival.id, provinceId, 'festival') }"
                              @click="onToggleFavorite(festival)"
                            >
                              <BookmarkIcon :size="13" :filled="isExperienceFavorite(festival.id, provinceId, 'festival')" />
                              <span>{{ isExperienceFavorite(festival.id, provinceId, 'festival') ? '已收藏' : '收藏' }}</span>
                            </button>
                            <button
                              class="action-btn btn-been"
                              :class="{ 'is-active': isExperienceBeen(festival.id, provinceId, 'festival') }"
                              @click="onToggleBeen(festival)"
                            >
                              <FlagIcon :size="13" :filled="isExperienceBeen(festival.id, provinceId, 'festival')" />
                              <span>{{ isExperienceBeen(festival.id, provinceId, 'festival') ? '已体验' : '体验' }}</span>
                            </button>
                            <button
                              class="action-btn btn-share"
                              @click="shareFestival(festival)"
                            >
                              <ShareIcon :size="13" />
                              <span>分享</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div class="inner-foot">
                        <div v-if="totalPages > 1" class="inner-pagination">
                          <button
                            class="pg-btn"
                            :class="{ disabled: currentPage <= 1 }"
                            :disabled="currentPage <= 1"
                            @click="changePage(currentPage - 1)"
                            aria-label="上一页"
                          >
                            <ChevronRightIcon class="flip" />
                          </button>
                          <div class="pg-numbers">
                            <template v-for="p in pageList" :key="p">
                              <span v-if="p === '...'" class="pg-ellipsis">…</span>
                              <button
                                v-else
                                class="pg-num"
                                :class="{ active: p === currentPage }"
                                @click="goToPage(p)"
                              >{{ p }}</button>
                            </template>
                          </div>
                          <button
                            class="pg-btn"
                            :class="{ disabled: currentPage >= totalPages }"
                            :disabled="currentPage >= totalPages"
                            @click="changePage(currentPage + 1)"
                            aria-label="下一页"
                          >
                            <ChevronRightIcon />
                          </button>
                        </div>

                        <div class="inner-zipcode">
                          <span class="zip-label">邮编</span>
                          <span class="zip-box">
                            {{ String(selectedMonthData.value).padStart(2, '0') }}{{ String(currentPage).padStart(2, '0') }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 右侧面板：节日详情（默认展开，无选择时显示空状态） -->
                  <div class="card-detail">
                    <!-- 空状态UI -->
                    <div v-if="!selectedFestival" class="detail-empty">
                      <div class="empty-deco-top">
                        <span class="empty-line"></span>
                        <span class="empty-ornament"><LeafIcon /></span>
                        <span class="empty-line"></span>
                      </div>
                      <div class="empty-icon-wrap">
                        <span class="empty-icon"><CalendarIcon /></span>
                      </div>
                      <h4 class="empty-title">节庆详情</h4>
                      <p class="empty-hint">请从左侧选择节庆活动</p>
                      <div class="empty-divider">
                        <span class="divider-dot"></span>
                        <span class="divider-dot"></span>
                        <span class="divider-dot"></span>
                      </div>
                      <p class="empty-poem">岁时节庆 · 四时流转</p>
                      <p class="empty-sub-poem">正月灯会 · 清明踏青 · 端午竞渡 · 中秋赏月</p>
                      <div class="empty-wax-seal">
                        <span class="seal-text">庆</span>
                      </div>
                    </div>

                    <!-- 详情内容 -->
                    <template v-else>
                      <button class="detail-close" @click="closeDetail" aria-label="关闭详情">
                        <CloseIcon />
                      </button>
                      <div class="detail-scroll">
                        <!-- 详情头部 -->
                        <div class="detail-header">
                          <div class="detail-date-loc">
                            <span class="detail-date">{{ selectedFestival.month }}{{ selectedFestival.day }}</span>
                            <span class="detail-loc"><LocationIcon :size="16" /> {{ selectedFestival.location }}</span>
                          </div>
                          <h4 class="detail-name">{{ selectedFestival.name }}</h4>
                          <div class="detail-tags">
                            <span class="detail-tag" :class="selectedFestival.isUnique ? 'tag-unique' : 'tag-traditional'">
                              {{ selectedFestival.isUnique ? '特色' : '传统' }}
                            </span>
                            <span v-if="selectedFestival.type" class="detail-tag tag-type">{{ selectedFestival.type }}</span>
                            <span v-if="selectedFestival.heritageLevel" class="detail-tag tag-heritage">{{ selectedFestival.heritageLevel }}</span>
                            <span v-if="selectedFestival.duration" class="detail-tag tag-duration">{{ selectedFestival.duration }}</span>
                          </div>
                        </div>

                        <!-- 节日简介 + 历史起源 -->
                        <div class="detail-section">
                          <h6 class="detail-section-title">节日简介</h6>
                          <p class="detail-desc">{{ selectedFestival.description }}</p>
                          <p v-if="selectedFestival.origin" class="detail-origin">{{ selectedFestival.origin }}</p>
                        </div>

                        <!-- 特色活动/看点 -->
                        <div v-if="selectedFestival.highlights?.length" class="detail-section">
                          <h6 class="detail-section-title">特色活动</h6>
                          <div class="detail-highlights">
                            <span v-for="(h, hi) in selectedFestival.highlights" :key="hi" class="highlight-pill">{{ h }}</span>
                          </div>
                        </div>

                        <!-- 实用信息网格 -->
                        <div class="detail-section">
                          <h6 class="detail-section-title">实用信息</h6>
                          <div class="detail-info-grid">
                            <div v-if="selectedFestival.bestTime" class="info-cell">
                              <span class="info-label">最佳时段</span>
                              <span class="info-value">{{ selectedFestival.bestTime }}</span>
                            </div>
                            <div v-if="selectedFestival.ticket" class="info-cell">
                              <span class="info-label">门票</span>
                              <span class="info-value">{{ selectedFestival.ticket }}</span>
                            </div>
                            <div v-if="selectedFestival.transport" class="info-cell info-cell--wide">
                              <span class="info-label">交通</span>
                              <span class="info-value">{{ selectedFestival.transport }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- 注意事项 -->
                        <div v-if="selectedFestival.tips?.length" class="detail-section">
                          <h6 class="detail-section-title">注意事项</h6>
                          <ul class="detail-tips">
                            <li v-for="(t, ti) in selectedFestival.tips" :key="ti" class="tip-item">{{ t }}</li>
                          </ul>
                        </div>

                        <!-- 关联景点 -->
                        <div v-if="selectedFestival.relatedSpots?.length" class="detail-section">
                          <h6 class="detail-section-title">关联景点</h6>
                          <div class="detail-spots">
                            <span v-for="(s, si) in selectedFestival.relatedSpots" :key="si" class="spot-pill">{{ s }}</span>
                          </div>
                        </div>

                        <!-- 操作按钮 -->
                        <div class="detail-actions">
                          <button
                            class="action-btn btn-fav"
                            :class="{ 'is-active': isExperienceFavorite(selectedFestival.id, provinceId, 'festival') }"
                            @click="onToggleFavorite(selectedFestival)"
                          >
                            <BookmarkIcon :size="16" :filled="isExperienceFavorite(selectedFestival.id, provinceId, 'festival')" />
                            <span>{{ isExperienceFavorite(selectedFestival.id, provinceId, 'festival') ? '已收藏' : '收藏' }}</span>
                          </button>
                          <button
                            class="action-btn btn-been"
                            :class="{ 'is-active': isExperienceBeen(selectedFestival.id, provinceId, 'festival') }"
                            @click="onToggleBeen(selectedFestival)"
                          >
                            <FlagIcon :size="16" :filled="isExperienceBeen(selectedFestival.id, provinceId, 'festival')" />
                            <span>{{ isExperienceBeen(selectedFestival.id, provinceId, 'festival') ? '已体验' : '体验' }}</span>
                          </button>
                          <button
                            class="action-btn btn-share"
                            @click="shareFestival(selectedFestival)"
                          >
                            <ShareIcon :size="16" />
                            <span>分享</span>
                          </button>
                        </div>
                      </div>
                    </template>
                  </div>

                </div>

              </div>
            </div>
          </Transition>
        </Teleport>
      </template>
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
  import GalaxyIcon from '../../../../../icons/pages/scenery/GalaxyIcon.vue';
  import CalendarIcon from '../../../../../icons/common/CalendarIcon.vue';
  import LocationIcon from '../../../../../icons/common/LocationIcon.vue';
  import CloseIcon from '../../../../../icons/common/CloseIcon.vue';
  import ChevronRightIcon from '../../../../../icons/common/ChevronRightIcon.vue';
  import LeafIcon from '../../../../../icons/common/LeafIcon.vue';
  import BookmarkIcon from '../../../../../icons/common/BookmarkIcon.vue';
  import HeartIcon from '../../../../../icons/common/HeartIcon.vue';
  import FlagIcon from '../../../../../icons/common/FlagIcon.vue';
  import ShareIcon from '../../../../../icons/common/ShareIcon.vue';
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelShare } from '../../../../TravelShareModal/useTravelShare';
  import TravelShareModal from '../../../../TravelShareModal/index.vue';

  const { show: showToast } = useTravelToast();
  const {
    isExperienceFavorite,
    isExperienceWant,
    isExperienceBeen,
    toggleExperienceFavorite,
    toggleExperienceWant,
    toggleExperienceBeen,
  } = useSceneryPrefs();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const shareFestival = (item: any): void => {
    if (!item?.name) return;
    openShare(item.name, `${item.name}｜${item.location || ''}｜节庆时令`);
    showToast({ type: 'share', message: `正在分享 ${item.name}` });
  };

  const onToggleFavorite = (item: any): void => {
    if (!item?.id) return;
    const wasFav = isExperienceFavorite(item.id, props.provinceId, 'festival');
    toggleExperienceFavorite(item.id, props.provinceId, 'festival');
    showToast({ type: 'info', message: wasFav ? `已取消收藏 ${item.name}` : `已收藏 ${item.name}` });
  };
  const onToggleWant = (item: any): void => {
    if (!item?.id) return;
    const wasWant = isExperienceWant(item.id, props.provinceId, 'festival');
    toggleExperienceWant(item.id, props.provinceId, 'festival');
    showToast({ type: 'want', message: wasWant ? `已移除想去 ${item.name}` : `已加入想去 ${item.name}` });
  };
  const onToggleBeen = (item: any): void => {
    if (!item?.id) return;
    const wasBeen = isExperienceBeen(item.id, props.provinceId, 'festival');
    toggleExperienceBeen(item.id, props.provinceId, 'festival');
    showToast({ type: 'success', message: wasBeen ? `已取消体验 ${item.name}` : `已体验 ${item.name}` });
  };

  const props = defineProps<{
    festivals: any[];
    provinceId: string;
  }>();

  const currentYear = ref(new Date().getFullYear());
  const currentMonth = ref(new Date().getMonth() + 1);
  const selectedMonth = ref<number | null>(null);
  const selectedFestival = ref<any>(null);
  const currentPage = ref(1);
  const pageSize = 6;

  const bindingRings = [
    { id: 1, pos: 8 },
    { id: 2, pos: 24 },
    { id: 3, pos: 40 },
    { id: 4, pos: 56 },
    { id: 5, pos: 72 },
    { id: 6, pos: 88 },
  ];

  const getSeason = (monthValue: number) => {
    if ([12, 1, 2].includes(monthValue)) return { key: 'winter', name: '冬' };
    if ([3, 4, 5].includes(monthValue)) return { key: 'spring', name: '春' };
    if ([6, 7, 8].includes(monthValue)) return { key: 'summer', name: '夏' };
    return { key: 'autumn', name: '秋' };
  };

  const totalFestivalCount = computed(() => (props.festivals || []).length);

  const monthsList = computed(() => {
    const monthLabels = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月',
    ];

    const grouped: Record<string, any[]> = {};
    (props.festivals || []).forEach((festival: any) => {
      const m = festival.month;
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push(festival);
    });

    return monthLabels.map((label, idx) => {
      const value = idx + 1;
      const season = getSeason(value);
      const festivals = (grouped[label] || []).slice().sort((a: any, b: any) => {
        const dayA = parseInt(String(a.day).replace('日', '')) || 0;
        const dayB = parseInt(String(b.day).replace('日', '')) || 0;
        return dayA - dayB;
      });
      return {
        value,
        label,
        festivals,
        isCurrent: value === currentMonth.value,
        season: season.key,
        seasonName: season.name,
      };
    });
  });

  const selectedMonthData = computed(() => {
    if (selectedMonth.value === null) return null;
    return monthsList.value.find((m) => m.value === selectedMonth.value) || null;
  });

  const totalPages = computed(() => {
    if (!selectedMonthData.value) return 1;
    return Math.max(1, Math.ceil(selectedMonthData.value.festivals.length / pageSize));
  });

  const pageFestivals = computed(() => {
    if (!selectedMonthData.value) return [];
    const list = selectedMonthData.value.festivals;
    const start = (currentPage.value - 1) * pageSize;
    return list.slice(start, start + pageSize);
  });

  const pageList = computed(() => {
    const total = totalPages.value;
    const cur = currentPage.value;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const nums = Array.from(
      new Set([1, total, cur - 1, cur, cur + 1]),
    ).filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const result: (number | string)[] = [];
    nums.forEach((n, i) => {
      if (i > 0 && nums[i - 1] !== n - 1) result.push('...');
      result.push(n);
    });
    return result;
  });

  const changePage = (page: number) => {
    currentPage.value = Math.min(Math.max(1, page), totalPages.value);
  };

  const goToPage = (p: number | string) => {
    if (typeof p === 'number') currentPage.value = p;
  };

  watch(selectedMonth, () => {
    currentPage.value = 1;
  });

  const selectMonth = (monthValue: number) => {
    selectedMonth.value =
      selectedMonth.value === monthValue ? null : monthValue;
    selectedFestival.value = null;
  };

  const selectFestival = (festival: any) => {
    selectedFestival.value = festival;
  };

  const closeDetail = () => {
    selectedFestival.value = null;
  };

  const closePanel = () => {
    selectedMonth.value = null;
    selectedFestival.value = null;
  };

  const onEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedMonth.value !== null) closePanel();
  };

  onMounted(() => document.addEventListener('keydown', onEscKey));
  onUnmounted(() => document.removeEventListener('keydown', onEscKey));
</script>

<style scoped src="./index.scss" lang="scss" />
