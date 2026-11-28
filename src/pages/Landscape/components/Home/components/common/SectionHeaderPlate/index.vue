<template>
  <div class="header-plate" :class="`tone-${tone}`">
    <span class="plate-glow" aria-hidden="true"></span>
    <span class="plate-sheen-clip" aria-hidden="true">
      <span class="plate-sheen"></span>
    </span>
    <span class="plate-corner tl" aria-hidden="true"></span>
    <span class="plate-corner tr" aria-hidden="true"></span>
    <span class="plate-corner bl" aria-hidden="true"></span>
    <span class="plate-corner br" aria-hidden="true"></span>

    <div class="header-left">
      <span class="title-badge" aria-hidden="true">
        <slot name="icon" />
      </span>
      <div class="header-text">
        <span class="title-label">{{ label }}</span>
        <h2 class="section-title">{{ title }}</h2>
        <p class="section-subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <span class="plate-chapter" aria-hidden="true">{{ chapter }}</span>

    <span v-if="rule" class="plate-rule" aria-hidden="true"></span>

    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'SectionHeaderPlate' });

  type SectionPlateTone =
    'violet' | 'blue' | 'pink' | 'red' | 'amber' | 'orange' | 'cyan';

  defineProps<{
    /** 英文小标签 */
    label: string;
    /** 中文主标题 */
    title: string;
    /** 副标题 */
    subtitle: string;
    /** 章节编号 */
    chapter: string;
    /** 色系，对应各分区主题色 */
    tone: SectionPlateTone;
    /** 是否展示刻度导轨装饰 */
    rule?: boolean;
  }>();
</script>

<style scoped lang="scss" src="./index.scss" />
