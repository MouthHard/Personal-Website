<script setup lang="ts">
  import { ref } from 'vue';
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import {
    CloseIcon,
    LocationIcon,
    ClockIcon,
    BookmarkIcon,
    FlagIcon,
    ShareIcon,
    ScrollIcon,
    MedalIcon,
  } from '@/pages/TravelGuide/icons/common';
  import FestivalDisplayModal from './FestivalDisplayModal/index.vue';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';

  defineProps<{
    experiences: ExperienceItem[];
  }>();

  const emit = defineEmits<{
    (e: 'remove', id: string, provinceId: string, category: string): void;
  }>();

  const { isExperienceFavorite, isExperienceBeen, toggleExperienceFavorite, toggleExperienceBeen } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const modalVisible = ref(false);
  const modalItem = ref<ExperienceItem | null>(null);
  const openDetail = (exp: ExperienceItem) => {
    modalItem.value = exp;
    modalVisible.value = true;
  };
  const closeDetail = () => {
    modalVisible.value = false;
  };

  const pidOf = (exp: any) => exp.provinceId || '';
  const CAT = 'festival';
  const isFav = (exp: any) => isExperienceFavorite(exp.id, pidOf(exp), CAT);
  const isBeen = (exp: any) => isExperienceBeen(exp.id, pidOf(exp), CAT);
  const onToggleFavorite = (exp: any) => {
    const was = isFav(exp);
    toggleExperienceFavorite(exp.id, pidOf(exp), CAT);
    showToast({ type: 'info', message: was ? `已取消收藏 ${exp.name}` : `已收藏 ${exp.name}` });
  };
  const onToggleBeen = (exp: any) => {
    const was = isBeen(exp);
    toggleExperienceBeen(exp.id, pidOf(exp), CAT);
    showToast({ type: 'success', message: was ? `已取消体验 ${exp.name}` : `已体验 ${exp.name}` });
  };
  const onShare = (exp: any) => {
    openShare(exp.name, `${exp.name}｜${exp.location}｜节庆日历`);
    showToast({ type: 'share', message: `正在分享 ${exp.name}` });
  };

  const monthNum = (exp: any): string => {
    const m = (exp.month || '').match(/(\d+)/);
    return m ? m[1] : '·';
  };
  const dayNum = (exp: any): string => {
    const m = (exp.day || '').match(/(\d+)/);
    return m ? m[1] : '·';
  };

</script>

<template>
  <ul class="cal-wall">
    <li v-for="exp in experiences" :key="exp.id" class="cal-unit" @click="openDetail(exp)">
      <!-- 挂绳 -->
      <div class="cal-hanger"></div>

      <!-- 顶部鎏金装订条 -->
      <div class="cal-binding">
        <span class="binding-ring" v-for="r in 5" :key="r" />
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

        <!-- 正面纸页（最上层 · 最亮 · 弯曲最多 · 阳光照射 · 主内容） -->
        <div class="cal-page">
          <!-- 左上角阳光斜照光束（整个纸张每个地方观感不一样） -->
          <div class="cal-sunbeam" aria-hidden="true"></div>

          <!-- 关闭按钮（纸张右上角） -->
          <button
            class="cal-remove"
            title="移除"
            @click.stop="emit('remove', exp.id, (exp as any).provinceId, (exp as any).experienceCategory)"
          >
            <CloseIcon :size="14" />
          </button>

          <!-- 日期大字区 -->
          <div class="cal-date-block">
            <span class="date-month">{{ monthNum(exp) }}</span>
            <span class="date-suffix">月</span>
            <span class="date-divider"></span>
            <span class="date-day">{{ dayNum(exp) }}</span>
            <span class="date-suffix">日</span>
          </div>

          <!-- 节日名 + tags -->
          <div class="cal-header">
            <h3 class="cal-title">{{ exp.name }}</h3>
            <div class="cal-tags-row">
              <span class="cal-type">{{ (exp as any).type || '节庆活动' }}</span>
              <span v-if="(exp as any).heritageLevel" class="cal-heritage">
                <MedalIcon :size="14" />
                <span>{{ (exp as any).heritageLevel }}</span>
              </span>
            </div>
          </div>

          <!-- 插图区 -->
          <div class="cal-image">
            <img :src="exp.image" :alt="exp.name" loading="lazy" />
          </div>

          <!-- 撕页虚线 -->
          <div class="cal-tear-line"></div>

          <!-- 信息栏（时长 + 地点 · 融入同一张纸） -->
          <div class="cal-meta">
            <span v-if="(exp as any).duration" class="meta-text"><ClockIcon :size="15" />{{ (exp as any).duration }}</span>
            <span v-if="(exp as any).duration" class="meta-dot"></span>
            <span class="meta-text"><LocationIcon :size="15" />{{ exp.location }}</span>
          </div>

          <!-- 操作按钮（2×2 网格 · 融入同一张纸） -->
          <div class="cal-actions">
            <button class="cal-act act-fav" :class="{ 'is-active': isFav(exp) }" @click.stop="onToggleFavorite(exp)" :title="isFav(exp) ? '已收藏' : '收藏'">
              <BookmarkIcon :size="15" :filled="isFav(exp)" />
              <span>{{ isFav(exp) ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="cal-act act-been" :class="{ 'is-active': isBeen(exp) }" @click.stop="onToggleBeen(exp)" :title="isBeen(exp) ? '已体验' : '标记体验'">
              <FlagIcon :size="15" :filled="isBeen(exp)" />
              <span>{{ isBeen(exp) ? '已体验' : '体验' }}</span>
            </button>
            <button class="cal-act act-share" @click.stop="onShare(exp)" title="分享">
              <ShareIcon :size="15" />
              <span>分享</span>
            </button>
            <button class="cal-act act-detail" @click.stop="openDetail(exp)" title="详情">
              <ScrollIcon :size="15" />
              <span>详情</span>
            </button>
          </div>
        </div>
      </div>

    </li>
  </ul>

  <FestivalDisplayModal :visible="modalVisible" :item="modalItem" @close="closeDetail" />

  <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl" @close="closeShare" />
</template>

<style scoped src="./index.scss" lang="scss"></style>
