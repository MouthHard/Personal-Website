<script setup lang="ts">
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import {
    CloseIcon,
    LocationIcon,
    ClockIcon,
    StarIcon,
  } from '@/pages/TravelGuide/icons/common';

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
</template>

<style scoped src="./index.scss" lang="scss"></style>