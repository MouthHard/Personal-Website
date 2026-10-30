<template>
        <Teleport to="body">
          <Transition name="postcard-modal">
            <div
              v-if="selectedMonthData"
              class="postcard-modal-mask"
              @click.self="emit('close-panel')"
            >
              <div class="postcard-modal-wrap">
                <div :key="selectedMonth ?? 0" class="greeting-card">

                  <button class="modal-close-btn" aria-label="关闭" @click="emit('close-panel')">
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
                            @click="emit('select-festival', festival)"
                        >
                          <div class="item-preview">
                            <img v-if="festival.image" :src="festival.image" :alt="festival.name" loading="lazy" />
                            <div class="item-date-stamp">
                              <span class="item-day">{{ festival.day }}</span>
                            </div>
                          </div>
                          <div class="item-info">
                            <h6 class="item-name">{{ festival.name }}</h6>
                            <div class="item-tags">
                              <span class="item-badge">
                                {{ festival.isUnique ? '特色' : '传统' }}
                              </span>
                              <span v-if="festival.type" class="item-type-tag">{{ festival.type }}</span>
                              <span v-if="festival.duration" class="item-duration-tag">{{ festival.duration }}</span>
                            </div>
                            <div class="item-loc">
                              <LocationIcon /><span>{{ festival.location }}</span>
                            </div>
                          </div>
                          <div class="item-actions" @click.stop>
                              <button
                                class="action-btn btn-fav"
                                :class="{ 'is-active': isExperienceFavorite(festival.id, provinceId, 'festival') }"
                                @click="emit('toggle-favorite', festival)"
                              >
                                <BookmarkIcon :size="13" :filled="isExperienceFavorite(festival.id, provinceId, 'festival')" />
                                <span>{{ isExperienceFavorite(festival.id, provinceId, 'festival') ? '已收藏' : '收藏' }}</span>
                              </button>
                              <button
                                class="action-btn btn-been"
                                :class="{ 'is-active': isExperienceBeen(festival.id, provinceId, 'festival') }"
                                @click="emit('toggle-been', festival)"
                              >
                                <FlagIcon :size="13" :filled="isExperienceBeen(festival.id, provinceId, 'festival')" />
                                <span>{{ isExperienceBeen(festival.id, provinceId, 'festival') ? '已体验' : '体验' }}</span>
                              </button>
                              <button
                                class="action-btn btn-share"
                                @click="emit('share', festival)"
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
                            aria-label="上一页"
                            @click="emit('change-page', currentPage - 1)"
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
                                @click="emit('go-to-page', p)"
                              >{{ p }}</button>
                            </template>
                          </div>
                          <button
                            class="pg-btn"
                            :class="{ disabled: currentPage >= totalPages }"
                            :disabled="currentPage >= totalPages"
                            aria-label="下一页"
                            @click="emit('change-page', currentPage + 1)"
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
                      <button class="detail-close" aria-label="关闭详情" @click="emit('close-detail')">
                        <CloseIcon />
                      </button>
                      <div class="detail-scroll">
                        <!-- 节庆头部图 -->
                        <div v-if="selectedFestival.image" class="detail-banner">
                          <img :src="selectedFestival.image" :alt="selectedFestival.name" loading="lazy" />
                        </div>

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
                            @click="emit('toggle-favorite', selectedFestival)"
                          >
                            <BookmarkIcon :size="16" :filled="isExperienceFavorite(selectedFestival.id, provinceId, 'festival')" />
                            <span>{{ isExperienceFavorite(selectedFestival.id, provinceId, 'festival') ? '已收藏' : '收藏' }}</span>
                          </button>
                          <button
                            class="action-btn btn-been"
                            :class="{ 'is-active': isExperienceBeen(selectedFestival.id, provinceId, 'festival') }"
                            @click="emit('toggle-been', selectedFestival)"
                          >
                            <FlagIcon :size="16" :filled="isExperienceBeen(selectedFestival.id, provinceId, 'festival')" />
                            <span>{{ isExperienceBeen(selectedFestival.id, provinceId, 'festival') ? '已体验' : '体验' }}</span>
                          </button>
                          <button
                            class="action-btn btn-share"
                            @click="emit('share', selectedFestival)"
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

<script setup lang="ts">
  import CalendarIcon from '../../../../../../icons/common/CalendarIcon.vue';
  import LocationIcon from '../../../../../../icons/common/LocationIcon.vue';
  import CloseIcon from '../../../../../../icons/common/CloseIcon.vue';
  import ChevronRightIcon from '../../../../../../icons/common/ChevronRightIcon.vue';
  import LeafIcon from '../../../../../../icons/common/LeafIcon.vue';
  import BookmarkIcon from '../../../../../../icons/common/BookmarkIcon.vue';
  import FlagIcon from '../../../../../../icons/common/FlagIcon.vue';
  import ShareIcon from '../../../../../../icons/common/ShareIcon.vue';

  defineProps<{
    selectedMonthData: any;
    selectedMonth: number | null;
    currentYear: number;
    selectedFestival: any;
    pageFestivals: any[];
    currentPage: number;
    totalPages: number;
    pageList: (number | string)[];
    provinceId: string;
    isExperienceFavorite: (id: string, provinceId: string, category: string) => boolean;
    isExperienceBeen: (id: string, provinceId: string, category: string) => boolean;
  }>();

  const emit = defineEmits<{
    (e: 'select-festival', festival: any): void;
    (e: 'close-detail'): void;
    (e: 'close-panel'): void;
    (e: 'change-page', page: number): void;
    (e: 'go-to-page', p: number | string): void;
    (e: 'toggle-favorite', festival: any): void;
    (e: 'toggle-been', festival: any): void;
    (e: 'share', festival: any): void;
  }>();
</script>

<style scoped src="./index.scss" lang="scss" />
