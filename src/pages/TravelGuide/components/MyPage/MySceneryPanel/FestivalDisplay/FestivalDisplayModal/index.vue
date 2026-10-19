<script setup lang="ts">
  import { computed } from 'vue';
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import CloseIcon from '@/pages/TravelGuide/icons/common/CloseIcon.vue';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import BookmarkIcon from '@/pages/TravelGuide/icons/common/BookmarkIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';

  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import SparklesIcon from '@/pages/TravelGuide/icons/common/SparklesIcon.vue';
  import WarningIcon from '@/pages/TravelGuide/icons/common/WarningIcon.vue';
  import MapIcon from '@/pages/TravelGuide/icons/common/MapIcon.vue';
  import SunIcon from '@/pages/TravelGuide/icons/common/SunIcon.vue';
  import ShoppingBagIcon from '@/pages/TravelGuide/icons/common/ShoppingBagIcon.vue';
  import BusIcon from '@/pages/TravelGuide/icons/pages/scenery/BusIcon.vue';
  import LightbulbIcon from '@/pages/TravelGuide/icons/common/LightbulbIcon.vue';
  import MedalIcon from '@/pages/TravelGuide/icons/common/MedalIcon.vue';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';

  const props = defineProps<{
    visible: boolean;
    item: ExperienceItem | null;
  }>();

  const emit = defineEmits<{
    close: [];
  }>();

  const { isExperienceFavorite, isExperienceBeen, toggleExperienceFavorite, toggleExperienceBeen } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const fest = computed(() => props.item as any);
  const pid = computed(() => fest.value?.provinceId || '');
  const CAT = 'festival';
  const isFav = computed(() => (props.item ? isExperienceFavorite(props.item.id, pid.value, CAT) : false));
  const isBeen = computed(() => (props.item ? isExperienceBeen(props.item.id, pid.value, CAT) : false));

  const monthNum = computed(() => {
    const m = (fest.value?.month || '').match(/(\d+)/);
    return m ? m[1] : '·';
  });
  const dayNum = computed(() => {
    const m = (fest.value?.day || '').match(/(\d+)/);
    return m ? m[1] : '·';
  });

  const onToggleFavorite = () => {
    if (!props.item) return;
    const was = isFav.value;
    toggleExperienceFavorite(props.item.id, pid.value, CAT);
    showToast({ type: 'info', message: was ? `已取消收藏 ${props.item.name}` : `已收藏 ${props.item.name}` });
  };
  const onToggleBeen = () => {
    if (!props.item) return;
    const was = isBeen.value;
    toggleExperienceBeen(props.item.id, pid.value, CAT);
    showToast({ type: 'success', message: was ? `已取消体验 ${props.item.name}` : `已体验 ${props.item.name}` });
  };
  const onShare = () => {
    if (!props.item) return;
    openShare(props.item.name, `${props.item.name}｜${props.item.location}｜节庆日历`);
    showToast({ type: 'share', message: `正在分享 ${props.item.name}` });
  };
</script>

<template>
  <Teleport to="body">
    <Transition name="festival-modal">
      <div v-if="visible && item" class="fm-mask" @click.self="emit('close')">
        <div class="festival-modal" role="dialog" aria-modal="true">
          <!-- 顶部鎏金装订条 + 金属环 -->
          <div class="cal-binding">
            <span class="binding-ring" v-for="r in 7" :key="r" />
          </div>

          <!-- 日历主体（多张纸页堆叠 + 正面内容页） -->
          <div class="cal-body">
            <!-- 多张日历纸页堆叠（被风吹动 · 每张纸独立弯曲卷 · 逐层变暗） -->
            <div class="cal-stack" aria-hidden="true">
              <div class="cal-sheet cal-sheet-5"></div>
              <div class="cal-sheet cal-sheet-4"></div>
              <div class="cal-sheet cal-sheet-3"></div>
              <div class="cal-sheet cal-sheet-2"></div>
            </div>

            <!-- 正面纸页（最上层 · 最亮 · 阳光照射 · 主内容） -->
            <div class="cal-page">
              <!-- 左上角阳光斜照光束 -->
              <div class="cal-sunbeam" aria-hidden="true"></div>

              <!-- 关闭按钮（纸张右上角） -->
              <button class="fm-close" aria-label="关闭" @click="emit('close')">
                <CloseIcon :size="16" />
              </button>

              <!-- 标题区（节日名 + 日期 + 地点 + 标签） -->
              <div class="fm-header">
                <div class="fm-date-block">
                  <span class="date-month">{{ monthNum }}</span>
                  <span class="date-suffix">月</span>
                  <span class="date-divider"></span>
                  <span class="date-day">{{ dayNum }}</span>
                  <span class="date-suffix">日</span>
                </div>

                <h2 class="fm-title">{{ item.name }}</h2>

                <div class="fm-meta">
                  <span class="meta-text"><LocationIcon :size="15" />{{ item.location }}</span>
                  <span v-if="fest.duration" class="meta-dot"></span>
                  <span v-if="fest.duration" class="meta-text"><ClockIcon :size="15" />{{ fest.duration }}</span>
                </div>

                <div class="fm-tags">
                  <span class="fm-tag" :class="fest.isUnique ? 'tag-unique' : 'tag-traditional'">
                    {{ fest.isUnique ? '特色' : '传统' }}
                  </span>
                  <span v-if="fest.type" class="fm-tag tag-type">{{ fest.type }}</span>
                  <span v-if="fest.heritageLevel" class="fm-tag tag-heritage">
                    <MedalIcon :size="13" />{{ fest.heritageLevel }}
                  </span>
                </div>
              </div>

              <!-- 可滚动正文区 -->
              <div class="fm-body">
                <!-- 节日简介 -->
                <div class="fm-section fm-section-intro">
                  <h6 class="fm-section-title"><LightbulbIcon :size="18" />节日简介</h6>
                  <div v-if="item.description" class="fm-paper-card">
                    <p class="fm-paper-text">{{ item.description }}</p>
                  </div>
                  <div v-if="fest.origin" class="fm-paper-card fm-paper-card--quote">
                    <p class="fm-paper-text fm-paper-text--quote">{{ fest.origin }}</p>
                  </div>
                </div>

                <!-- 特色活动 -->
                <div v-if="fest.highlights && fest.highlights.length" class="fm-section fm-section-highlights">
                  <h6 class="fm-section-title"><SparklesIcon :size="18" />特色活动</h6>
                  <div class="fm-highlight-list">
                    <div v-for="(h, hi) in fest.highlights" :key="hi" class="fm-highlight-item">
                      <span class="fm-highlight-seal">{{ Number(hi) + 1 }}</span>
                      <span class="fm-highlight-name">{{ h }}</span>
                    </div>
                  </div>
                </div>

                <!-- 实用信息 -->
                <div class="fm-section fm-section-info">
                  <h6 class="fm-section-title"><MapIcon :size="18" />实用信息</h6>
                  <div class="fm-info-grid">
                    <div v-if="fest.bestTime" class="fm-info-item">
                      <span class="fm-info-label"><SunIcon :size="14" />最佳时段</span>
                      <span class="fm-info-val">{{ fest.bestTime }}</span>
                    </div>
                    <div v-if="fest.ticket" class="fm-info-item">
                      <span class="fm-info-label"><ShoppingBagIcon :size="14" />门票</span>
                      <span class="fm-info-val">{{ fest.ticket }}</span>
                    </div>
                    <div v-if="fest.transport" class="fm-info-item fm-info-item--wide">
                      <span class="fm-info-label"><BusIcon :size="14" />交通</span>
                      <span class="fm-info-val">{{ fest.transport }}</span>
                    </div>
                  </div>
                </div>

                <!-- 注意事项 -->
                <div v-if="fest.tips && fest.tips.length" class="fm-section fm-section-tips">
                  <h6 class="fm-section-title"><WarningIcon :size="18" />注意事项</h6>
                  <div class="fm-tips-list">
                    <div v-for="(t, ti) in fest.tips" :key="ti" class="fm-tip-item">
                      <span class="fm-tip-seal">{{ Number(ti) + 1 }}</span>
                      <span class="fm-tip-text">{{ t }}</span>
                    </div>
                  </div>
                </div>

                <!-- 关联景点 -->
                <div v-if="fest.relatedSpots && fest.relatedSpots.length" class="fm-section fm-section-spots">
                  <h6 class="fm-section-title"><MapIcon :size="18" />关联景点</h6>
                  <div class="fm-spots-route">
                    <div v-for="(s, si) in fest.relatedSpots" :key="si" class="fm-spot-station">
                      <span class="station-node"></span>
                      <span class="station-name">{{ s }}</span>
                      <span v-if="Number(si) < fest.relatedSpots.length - 1" class="station-link"></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮区（融入同一张纸） -->
              <div class="fm-actions">
                <button class="fm-act act-fav" :class="{ 'is-active': isFav }" @click="onToggleFavorite">
                  <BookmarkIcon :size="16" :filled="isFav" /><span>{{ isFav ? '已收藏' : '收藏' }}</span>
                </button>
                <button class="fm-act act-been" :class="{ 'is-active': isBeen }" @click="onToggleBeen">
                  <FlagIcon :size="16" :filled="isBeen" /><span>{{ isBeen ? '已体验' : '体验' }}</span>
                </button>
                <button class="fm-act act-share" @click="onShare">
                  <ShareIcon :size="16" /><span>分享</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl" @close="closeShare" />
  </Teleport>
</template>

<style scoped src="./index.scss" lang="scss"></style>
