<template>
  <div class="stats-banner">
    <div
      v-for="(stat, index) in stats"
      :key="index"
      class="stat-item"
      :class="getGradientClass(stat.gradient)"
    >
      <div class="stat-value">{{ stat.value }}</div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script>
  // 仅声明组件名；props 与逻辑统一放在 <script setup> 中，
  // 避免同一组件内 defineProps 与 export default.props 重复定义（Vue 会告警且合并结果不确定）。
  export default {
    name: 'ProfileStatsBanner',
  };
</script>

<script setup>
  defineProps({
    stats: {
      type: Array,
      required: true,
      default: () => [
        { value: '0', label: '粉丝', gradient: 'purple' },
        { value: '0', label: '关注', gradient: 'pink' },
        { value: '0', label: '听歌', gradient: 'blue' },
        { value: '0', label: '歌单', gradient: 'green' },
        { value: '0', label: '喜欢', gradient: 'gold' },
      ],
      validator: (value) => {
        return value.every((stat) => {
          return (
            typeof stat.value === 'string' &&
            typeof stat.label === 'string' &&
            typeof stat.gradient === 'string'
          );
        });
      },
    },
  });

  const getGradientClass = (gradient) => {
    const gradientMap = {
      purple: 'gradient-purple',
      pink: 'gradient-pink',
      blue: 'gradient-blue',
      green: 'gradient-green',
      gold: 'gradient-gold',
    };
    return gradientMap[gradient] || 'gradient-purple';
  };
</script>

<style src="./index.scss" lang="scss"></style>
