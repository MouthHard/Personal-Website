<template>
  <section class="hero-section">
    <div class="hero-container">
      <router-link to="/" class="back-btn">
        <span class="back-icon">
          <HomeIcon />
        </span>
        <span class="back-text">返回首页</span>
      </router-link>
      <div class="hero-content">博物</div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { HomeIcon } from '@/pages/Museum/icons/common';
</script>

<style lang="scss" scoped src="./index.scss"></style>
