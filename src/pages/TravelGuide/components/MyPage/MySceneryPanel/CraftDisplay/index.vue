<script setup lang="ts">
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import {
    CloseIcon,
    LocationIcon,
    ClockIcon,
    StarIcon,
  } from '@/pages/TravelGuide/icons/common';
  import BookmarkIcon from '@/pages/TravelGuide/icons/common/BookmarkIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';
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

  const heritageLabel: Record<string, string> = {
    national: '国家级非遗',
    provincial: '省级非遗',
    municipal: '市级非遗',
  };

  const { isExperienceFavorite, isExperienceBeen, toggleExperienceFavorite, toggleExperienceBeen } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const pidOf = (exp: any) => exp.provinceId || '';
  const isFav = (exp: any) => isExperienceFavorite(exp.id, pidOf(exp), 'craft');
  const isBeen = (exp: any) => isExperienceBeen(exp.id, pidOf(exp), 'craft');
  const onToggleFavorite = (exp: any) => {
    const was = isFav(exp);
    toggleExperienceFavorite(exp.id, pidOf(exp), 'craft');
    showToast({ type: 'info', message: was ? `已取消收藏 ${exp.name}` : `已收藏 ${exp.name}` });
  };
  const onToggleBeen = (exp: any) => {
    const was = isBeen(exp);
    toggleExperienceBeen(exp.id, pidOf(exp), 'craft');
    showToast({ type: 'success', message: was ? `已取消体验 ${exp.name}` : `已体验 ${exp.name}` });
  };
  const onShare = (exp: any) => {
    openShare(exp.name, `${exp.name}｜${exp.location || ''}｜非遗匠作`);
    showToast({ type: 'share', message: `正在分享 ${exp.name}` });
  };
</script>

<template>
  <ul class="scroll-rack">
    <li v-for="exp in experiences" :key="exp.id" class="scroll-row">
      <span class="scroll-stick stick-l"><i></i></span>

      <div class="scroll-roll">
        <header class="roll-header">
          <span class="header-label">匠作</span>
          <h4 class="header-title">{{ exp.name }}</h4>
          <span v-if="exp.rating" class="header-rating">
            <StarIcon />
            <b>{{ exp.rating.toFixed(1) }}</b>
            <i v-if="exp.reviewCount">{{ exp.reviewCount }}条</i>
          </span>
          <div class="header-actions">
            <button
              class="craft-act act-fav"
              :class="{ 'is-active': isFav(exp) }"
              @click.stop="onToggleFavorite(exp)"
            >
              <BookmarkIcon :size="15" :filled="isFav(exp)" />
              <span>{{ isFav(exp) ? '已收藏' : '收藏' }}</span>
            </button>
            <button
              class="craft-act act-been"
              :class="{ 'is-active': isBeen(exp) }"
              @click.stop="onToggleBeen(exp)"
            >
              <FlagIcon :size="15" :filled="isBeen(exp)" />
              <span>{{ isBeen(exp) ? '已体验' : '体验' }}</span>
            </button>
            <button class="craft-act act-share" @click.stop="onShare(exp)">
              <ShareIcon :size="15" />
              <span>分享</span>
            </button>
          </div>
        </header>

        <div class="roll-main">
          <!-- 左栏：标签与元数据 -->
          <section class="main-left">
            <div v-if="exp.heritageLevel || exp.type" class="meta-row">
              <span v-if="exp.heritageLevel" class="plate-heritage">{{ heritageLabel[exp.heritageLevel] || '非遗' }}</span>
              <span v-if="exp.type" class="plate-type">{{ exp.type }}</span>
            </div>

            <div class="info-bar">
              <span v-if="exp.location" class="bar-cell is-loc"><LocationIcon :size="16" />{{ exp.location }}</span>
              <span v-if="exp.duration" class="bar-cell is-time"><ClockIcon :size="16" />{{ exp.duration }}</span>
              <span v-if="exp.difficulty" class="bar-cell is-hard">{{ exp.difficulty }}</span>
            </div>

            <div v-if="exp.suitableFor?.length" class="left-block">
              <span class="block-cap">宜</span>
              <div class="block-tags">
                <span v-for="(a, ai) in exp.suitableFor" :key="ai" class="tag-suit">{{ a }}</span>
              </div>
            </div>

            <div v-if="exp.tags?.length" class="left-block">
              <span class="block-cap">类</span>
              <div class="block-tags">
                <span v-for="(t, ti) in exp.tags" :key="ti" class="tag-mark">{{ t }}</span>
              </div>
            </div>
          </section>

          <!-- 中栏：内容详述 -->
          <section class="main-mid">
            <p v-if="exp.description" class="mid-desc">{{ exp.description }}</p>

            <div v-if="exp.highlights?.length" class="mid-benefit">
              <span class="benefit-bellows"></span>
              <span class="benefit-dots">
                <i class="spark sp-a"></i>
                <i class="spark sp-b"></i>
                <i class="spark sp-c"></i>
              </span>
              <span class="benefit-text">{{ exp.highlights.slice(0, 3).join(' · ') }}</span>
            </div>

            <div v-if="exp.steps?.length" class="mid-steps">
              <span class="steps-cap">工序</span>
              <div class="steps-lane">
                <template v-for="(s, si) in exp.steps" :key="si">
                  <span v-if="si > 0" class="lane-knot"></span>
                  <span class="lane-paper">{{ s }}</span>
                </template>
              </div>
            </div>
          </section>

          <!-- 右栏：画心与价签 -->
          <aside class="main-right">
            <div class="side-painting">
              <div class="painting-frame">
                <img :src="exp.image" :alt="exp.name" loading="lazy" />
                <span class="frame-thread"></span>
                <span class="frame-knot k-tl"></span>
                <span class="frame-knot k-tr"></span>
                <span class="frame-knot k-bl"></span>
                <span class="frame-knot k-br"></span>
                <span v-if="exp.heritageLevel" class="painting-seal">非遗</span>
              </div>
            </div>

            <div class="side-quote">
              <span v-if="exp.price" class="quote-price">¥{{ exp.price }}</span>
              <span v-if="exp.instructor" class="quote-master">匠人 · {{ exp.instructor }}</span>
            </div>

          </aside>
        </div>
      </div>

      <span class="scroll-stick stick-r"><i></i></span>

      <button class="scroll-remove" title="移除" @click="emit('remove', exp.id, (exp as any).provinceId, (exp as any).experienceCategory)">
        <CloseIcon :size="13" />
      </button>
    </li>
  </ul>

  <TravelShareModal
    :visible="shareVisible"
    :title="shareTitle"
    :share-text="shareText"
    :share-url="shareUrl"
    @close="closeShare"
  />
</template>

<style scoped src="./index.scss" lang="scss"></style>