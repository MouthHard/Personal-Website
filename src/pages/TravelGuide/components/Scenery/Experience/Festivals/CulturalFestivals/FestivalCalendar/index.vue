<template>
  <div class="desk-calendar">

    <div class="binding-spine">
      <span
        v-for="ring in bindingRings"
        :key="ring.id"
        class="binding-ring"
        :style="{ left: `calc(${ring.pos}% - 9px)` }"
      ></span>
    </div>

    <div class="cover-header">
      <div class="cover-title-row">
        <span class="cover-ornament"><LeafIcon /></span>
        <h4 class="cover-title">{{ currentYear }} 节庆月历</h4>
        <span class="cover-ornament"><CalendarIcon /></span>
      </div>
      <p class="cover-subtitle">十二个月特色节庆一览 · 共 {{ totalFestivalCount }} 个节庆</p>
    </div>

    <div v-if="totalFestivalCount === 0" class="empty-state">
      <div class="empty-calendar-page">
        <div class="empty-binding-holes">
          <span v-for="r in 5" :key="r" class="hole"></span>
        </div>
        <div class="empty-page-body">
          <div class="empty-icon-wrap">
            <span class="empty-icon"><GalaxyIcon /></span>
          </div>
          <h5 class="empty-title">暂无节庆数据</h5>
          <p class="empty-desc">该地区的特色节庆活动正在收录中</p>
          <div class="empty-wax-seal">
            <span class="seal-text">录</span>
          </div>
          <div class="empty-season-tags">
            <span class="season-tag season-spring">春</span>
            <span class="season-tag season-summer">夏</span>
            <span class="season-tag season-autumn">秋</span>
            <span class="season-tag season-winter">冬</span>
          </div>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="calendar-pages">
        <div
          v-for="month in monthsList"
          :key="month.value"
          class="page"
          :class="[
            `season-${month.season}`,
            { 'has-festivals': month.festivals.length > 0,
              'is-current': month.isCurrent,
              'is-active': selectedMonth === month.value },
          ]"
          @click="month.festivals.length > 0 && emit('select-month', month.value)"
        >
          <span class="punch-hole hole-left"></span>
          <span class="punch-hole hole-right"></span>
          <span class="page-fold"></span>

          <div class="page-head">
            <span class="page-season-tag">{{ month.seasonName }}</span>
            <span class="page-month-num">{{ month.label }}</span>
            <span v-if="month.festivals.length > 0" class="page-count-chip">
              {{ month.festivals.length }}
            </span>
          </div>

          <div class="page-body">
            <div v-if="month.festivals.length > 0" class="stickers">
              <div
                v-for="(festival, idx) in month.festivals.slice(0, 2)"
                :key="festival.id"
                class="sticker"
                :class="[
                  festival.isUnique ? 'stamp-red' : 'note-blue',
                  `tilt-${(Number(idx) % 3) + 1}`,
                ]"
              >
                <span class="sticker-tape"></span>
                <span class="sticker-date">{{ festival.day }}</span>
                <span class="sticker-name">{{ festival.name }}</span>
                <span class="sticker-type-mark">
                  {{ festival.isUnique ? '特' : '传' }}
                </span>
              </div>
              <div v-if="month.festivals.length > 2" class="more-chip">
                +{{ month.festivals.length - 2 }} 更多
              </div>
              <div class="page-cta">
                <span>查看详情</span>
                <span class="cta-arrow"><ChevronRightIcon /></span>
              </div>
            </div>
            <div v-else class="blank-page">
              <div class="blank-grid"></div>
              <span class="blank-text">暂无</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import GalaxyIcon from '../../../../../../icons/pages/scenery/GalaxyIcon.vue';
  import CalendarIcon from '../../../../../../icons/common/CalendarIcon.vue';
  import LeafIcon from '../../../../../../icons/common/LeafIcon.vue';
  import ChevronRightIcon from '../../../../../../icons/common/ChevronRightIcon.vue';

  defineProps<{
    currentYear: number;
    totalFestivalCount: number;
    monthsList: any[];
    selectedMonth: number | null;
  }>();

  const emit = defineEmits<{
    (e: 'select-month', monthValue: number): void;
  }>();

  const bindingRings = [
    { id: 1, pos: 8 },
    { id: 2, pos: 24 },
    { id: 3, pos: 40 },
    { id: 4, pos: 56 },
    { id: 5, pos: 72 },
    { id: 6, pos: 88 },
  ];
</script>

<style scoped src="./index.scss" lang="scss" />