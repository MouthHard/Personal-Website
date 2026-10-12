<script setup lang="ts">
import SparklesIcon from '../../../../../icons/common/SparklesIcon.vue';

defineProps<{
  tips: { question: string; answer: string }[];
}>();
</script>

<template>
  <section v-if="tips.length > 0" class="guide-block tips-block">
    <h3 class="block-title">
      <SparklesIcon class="title-icon" />
      <span>避坑小贴士</span>
    </h3>
    <div class="hazard-matrix">
      <article
        v-for="(tip, i) in tips"
        :key="tip.question"
        class="hazard-cell"
      >
        <div class="cell-crystal-column">
          <div class="crystal-hex crystal-hex-top"></div>
          <div class="crystal-link"></div>
          <div class="crystal-hex crystal-hex-mid"></div>
          <div class="crystal-link"></div>
          <div class="crystal-hex crystal-hex-bot"></div>
        </div>

        <div class="cell-alert-lamp">
          <div class="alert-ring alert-ring-outer"></div>
          <div class="alert-ring alert-ring-inner"></div>
          <div class="alert-core"></div>
        </div>

        <div class="cell-head-row">
          <div class="cell-beacon">
            <div class="beacon-hex beacon-hex-outer"></div>
            <div class="beacon-hex beacon-hex-inner"></div>
            <span class="beacon-num">{{ i + 1 }}</span>
            <div class="beacon-shadow"></div>
          </div>
          <h4 class="hazard-title">{{ tip.question }}</h4>
        </div>

        <div class="cell-holo-display">
          <p class="hazard-briefing">{{ tip.answer }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss" src="./index.scss" />