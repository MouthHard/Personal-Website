<template>
  <div class="star-background-container">
    <StarFieldIcon />

    <div class="shooting-stars-layer">
      <div
        v-for="meteor in activeMeteors"
        :key="meteor.id"
        class="shooting-star"
        :style="{
          left:
            meteor.x +
            Math.cos((meteor.angle * Math.PI) / 180) * meteor.progress +
            'px',
          top:
            meteor.y +
            Math.sin((meteor.angle * Math.PI) / 180) * meteor.progress +
            'px',
          width: meteor.length + 'px',
          transform: 'rotate(' + meteor.angle + 'deg)',
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, onMounted, onUnmounted, computed } from 'vue';
  import StarFieldIcon from '@/pages/Landscape/icon/components/common/StarBackground/StarFieldIcon.vue';

  interface Meteor {
    id: number;
    x: number;
    y: number;
    length: number;
    angle: number;
    speed: number;
    progress: number;
    active: boolean;
  }

  const meteors = shallowRef<Meteor[]>([]);
  // 生成流星
  const generateMeteors = () => {
    const newMeteors: Meteor[] = [];

    for (let i = 0; i < 15; i++) {
      newMeteors.push({
        id: i,
        x: 0,
        y: 0,
        length: Math.random() * 1000 + 100,
        angle: 0,
        speed: Math.random() * 20 + 5,
        progress: 0,
        active: false,
      });
    }

    meteors.value = newMeteors;
  };

  const activeMeteors = computed(() => meteors.value.filter((m) => m.active));

  const triggerMeteor = () => {
    const inactiveMeteor = meteors.value.find((m) => !m.active);
    if (!inactiveMeteor) return;

    const angle = Math.random() * 360;

    let startX = 0;
    let startY = 0;

    if (angle >= 0 && angle < 90) {
      startX = Math.random() * window.innerWidth;
      startY = -100;
    } else if (angle >= 90 && angle < 180) {
      startX = window.innerWidth + 100;
      startY = Math.random() * window.innerHeight;
    } else if (angle >= 180 && angle < 270) {
      startX = Math.random() * window.innerWidth;
      startY = window.innerHeight + 100;
    } else {
      startX = -100;
      startY = Math.random() * window.innerHeight;
    }

    inactiveMeteor.x = startX;
    inactiveMeteor.y = startY;
    inactiveMeteor.angle = angle;
    inactiveMeteor.progress = 0;
    inactiveMeteor.active = true;
  };

  let animationFrameId: number;
  let lastTriggerTime = 0;

  const animate = (timestamp: number) => {
    if (timestamp - lastTriggerTime > 2500 && Math.random() > 0.4) {
      triggerMeteor();
      lastTriggerTime = timestamp;
    }

    meteors.value.forEach((meteor) => {
      if (meteor.active) {
        meteor.progress += meteor.speed;

        const angleRad = (meteor.angle * Math.PI) / 180;
        const distance = meteor.progress;

        const currentX = meteor.x + Math.cos(angleRad) * distance;
        const currentY = meteor.y + Math.sin(angleRad) * distance;

        if (
          currentX < -200 ||
          currentX > window.innerWidth + 200 ||
          currentY < -200 ||
          currentY > window.innerHeight + 200
        ) {
          meteor.active = false;
        }
      }
    });

    animationFrameId = requestAnimationFrame(animate);
  };

  onMounted(() => {

    generateMeteors();

    animationFrameId = requestAnimationFrame(animate);
  });

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
</script>

<style scoped lang="scss" src="./index.scss" />
