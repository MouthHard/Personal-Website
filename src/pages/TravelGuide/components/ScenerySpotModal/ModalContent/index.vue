<template>
  <div class="modal-content">
    <!-- 标题区 -->
    <header class="modal-header">

      <h2 class="modal-name">{{ spot.name }}</h2>
      <div v-if="spot.rankBadge" class="modal-rank">{{ spot.rankBadge }}</div>
      <p v-if="spot.highlight" class="modal-highlight">{{ spot.highlight }}</p>
    </header>

    <!-- 元信息仪表组 -->
    <section class="modal-section meta-section">
      <h3 class="section-title">
        <span class="section-num">01</span>
        <LocationIcon width="15" height="15" />
        <span>基本信息</span>
      </h3>
      <div class="meta-grid">
        <div v-if="spot.location" class="meta-cell">
          <div class="cell-head">
            <span class="cell-icon"><LocationIcon width="14" height="14" /></span>
            <span class="cell-label">位置</span>
          </div>
          <span class="cell-value">{{ spot.location }}</span>
        </div>
        <div v-if="spot.distance" class="meta-cell">
          <div class="cell-head">
            <span class="cell-icon"><MapIcon width="14" height="14" /></span>
            <span class="cell-label">距离</span>
          </div>
          <span class="cell-value">{{ spot.distance }}</span>
        </div>
        <div v-if="spot.bestTime" class="meta-cell">
          <div class="cell-head">
            <span class="cell-icon"><CalendarIcon width="14" height="14" /></span>
            <span class="cell-label">最佳时间</span>
          </div>
          <span class="cell-value">{{ spot.bestTime }}</span>
        </div>
        <div v-if="spot.openTime" class="meta-cell">
          <div class="cell-head">
            <span class="cell-icon"><ClockIcon width="14" height="14" /></span>
            <span class="cell-label">开放时间</span>
          </div>
          <span class="cell-value">{{ spot.openTime }}</span>
        </div>
        <div v-if="spot.visitDuration" class="meta-cell">
          <div class="cell-head">
            <span class="cell-icon"><SunIcon width="14" height="14" /></span>
            <span class="cell-label">建议时长</span>
          </div>
          <span class="cell-value">{{ spot.visitDuration }}</span>
        </div>
        <div v-if="spot.popularity" class="meta-cell">
          <div class="cell-head">
            <span class="cell-icon"><FireIcon width="14" height="14" /></span>
            <span class="cell-label">热度指数</span>
          </div>
          <span class="cell-value">{{ spot.popularity }}</span>
        </div>
      </div>
    </section>

    <!-- 详细描述 -->
    <section v-if="spot.description" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">02</span>
        <ScrollIcon width="15" height="15" />
        <span>景点简介</span>
      </h3>
      <p class="section-text">{{ spot.description }}</p>
    </section>

    <!-- 特色标签 -->
    <section v-if="spot.tags?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">03</span>
        <HashIcon width="15" height="15" />
        <span>特色标签</span>
      </h3>
      <div class="section-tags">
        <span
          v-for="(tag, i) in spot.tags"
          :key="i"
          class="section-tag"
          :class="`stag-${i % 3}`"
        >
          {{ tag }}
        </span>
      </div>
    </section>

    <!-- 地貌标签 -->
    <section v-if="spot.landformTags?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">04</span>
        <MapIcon width="15" height="15" />
        <span>地貌特征</span>
      </h3>
      <div class="section-tags">
        <span
          v-for="tag in spot.landformTags"
          :key="tag"
          class="section-tag stag-geo"
        >
          {{ tag }}
        </span>
      </div>
    </section>

    <!-- 适合人群 -->
    <section v-if="spot.audienceTags?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">05</span>
        <CheckIcon width="15" height="15" />
        <span>适合人群</span>
      </h3>
      <div class="section-tags">
        <span
          v-for="audience in spot.audienceTags"
          :key="audience"
          class="section-tag stag-aud"
        >
          {{ audience }}
        </span>
      </div>
    </section>


    <!-- 门票详情 -->
    <section v-if="spot.ticketDetails?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">06</span>
        <ShoppingBagIcon width="15" height="15" />
        <span>门票详情</span>
      </h3>
      <div class="ticket-scroll">
        <div
          v-for="(t, i) in spot.ticketDetails"
          :key="i"
          class="ticket-stub"
        >
          <span class="stub-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="stub-notch"></span>
          <span class="stub-content">{{ t }}</span>
        </div>
      </div>
    </section>

    <!-- 交通指南 -->
    <section v-if="spot.transportInfo?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">07</span>
        <LocationIcon width="15" height="15" />
        <span>交通指南</span>
      </h3>
      <div class="transport-grid">
        <div
          v-for="(t, i) in spot.transportInfo"
          :key="i"
          class="transport-card"
        >
          <div class="tc-head">
            <span class="tc-tag">{{ ['飞机', '高铁', '自驾', '长途'][i] || '其他' }}</span>
          </div>
          <p class="tc-text">{{ t }}</p>
        </div>
      </div>
    </section>

    <!-- 开放时间详细 -->
    <section v-if="spot.openTimeDetail?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">08</span>
        <ClockIcon width="15" height="15" />
        <span>开放时间</span>
      </h3>
      <div class="opentime-board">
        <div
          v-for="(t, i) in spot.openTimeDetail"
          :key="i"
          class="opentime-row"
        >
          <span class="opentime-dot"></span>
          <span class="opentime-text">{{ t }}</span>
        </div>
      </div>
    </section>

    <!-- 推荐游览路线 -->
    <section v-if="spot.recommendedRoutes?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">09</span>
        <MapIcon width="15" height="15" />
        <span>推荐路线</span>
      </h3>
      <div class="route-cards">
        <div
          v-for="(r, i) in spot.recommendedRoutes"
          :key="i"
          class="route-card"
        >
          <div class="route-tab">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="route-body">
            <h4 class="route-name">{{ r.name }}</h4>
            <div class="route-stats">
              <span class="stat-chip stat-time">
                <ClockIcon width="12" height="12" />
                {{ r.duration }}
              </span>
              <span class="stat-chip stat-diff">
                <FireIcon width="12" height="12" />
                {{ r.difficulty }}
              </span>
            </div>
            <p class="route-desc">{{ r.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 景区设施 -->
    <section v-if="spot.facilities?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">10</span>
        <HomeIcon width="15" height="15" />
        <span>景区设施</span>
      </h3>
      <div class="facility-flow">
        <div
          v-for="(f, i) in spot.facilities"
          :key="i"
          class="facility-row"
          :class="`frow-${i % 5}`"
        >
          <div class="ff-badge">
            <component
              v-if="facilityIconMap[f.split(':')[0]]"
              :is="facilityIconMap[f.split(':')[0]]"
              :size="22"
            />
            <span v-else class="ff-badge-text">{{ f.split(':')[0].charAt(0) }}</span>
          </div>
          <div class="ff-body">
            <div class="ff-type">{{ f.split(':')[0] }}</div>
            <p class="ff-desc">{{ f.slice(f.indexOf(':') + 1).trim() }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 温馨提示 -->
    <section v-if="spot.tips?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">11</span>
        <LightbulbIcon width="15" height="15" />
        <span>温馨提示</span>
      </h3>
      <ul class="tips-list">
        <li
          v-for="(tip, i) in spot.tips"
          :key="i"
          class="tips-sign"
          :class="`tsign-${i % 5}`"
        >
          <span class="ts-num">{{ i + 1 }}</span>
          <span class="ts-text">{{ tip }}</span>
        </li>
      </ul>
    </section>

    <!-- 最佳拍照点 -->
    <section v-if="spot.photoSpots?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">12</span>
        <PictureIcon width="15" height="15" />
        <span>最佳拍照点</span>
      </h3>
      <div class="photo-strip">
        <div class="photo-frames">
          <div
            v-for="(p, i) in spot.photoSpots"
            :key="i"
            class="photo-frame"
          >
            <span class="pf-no">F{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="pf-text">{{ p }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 周边联游 -->
    <section v-if="spot.nearbySpots?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">13</span>
        <SceneryIcon width="15" height="15" />
        <span>周边联游</span>
      </h3>
      <div class="nearby-boards">
        <div
          v-for="(item, i) in nearbyParsed"
          :key="i"
          class="nearby-board"
          :class="`nboard-${i % 3}`"
        >
          <span class="nb-pole"></span>
          <span class="nb-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="nb-name">{{ item.name }}</span>
          <span class="nb-meter">
            <span class="nb-km">{{ item.hasKm ? item.km : '--' }}</span>
            <span class="nb-km-unit">{{ item.hasKm ? 'km' : '' }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- 季节指南 -->
    <section v-if="spot.seasonalGuide?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">14</span>
        <CalendarIcon width="15" height="15" />
        <span>季节指南</span>
      </h3>
      <div class="season-grid">
        <div
          v-for="(s, i) in spot.seasonalGuide"
          :key="i"
          class="season-card"
          :class="`season-${i}`"
        >
          <span class="season-label">{{ ['春', '夏', '秋', '冬'][i] || '·' }}</span>
          <span class="season-text">{{ s }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import LocationIcon from '../../../icons/common/LocationIcon.vue';
  import ScrollIcon from '../../../icons/common/ScrollIcon.vue';
  import HashIcon from '../../../icons/common/HashIcon.vue';
  import MapIcon from '../../../icons/common/MapIcon.vue';
  import CheckIcon from '../../../icons/common/CheckIcon.vue';
  import FireIcon from '../../../icons/common/FireIcon.vue';
  import ShoppingBagIcon from '../../../icons/common/ShoppingBagIcon.vue';
  import ClockIcon from '../../../icons/common/ClockIcon.vue';
  import HomeIcon from '../../../icons/common/HomeIcon.vue';
  import LightbulbIcon from '../../../icons/common/LightbulbIcon.vue';
  import PictureIcon from '../../../icons/pages/scenery/PictureIcon.vue';
  import SceneryIcon from '../../../icons/common/SceneryIcon.vue';
  import CalendarIcon from '../../../icons/common/CalendarIcon.vue';
  import SunIcon from '../../../icons/common/SunIcon.vue';
  import CableCarIcon from '../../../icons/pages/scenery/CableCarIcon.vue';
  import RestaurantIcon from '../../../icons/pages/scenery/RestaurantIcon.vue';
  import HotelIcon from '../../../icons/pages/scenery/HotelIcon.vue';
  import ParkingIcon from '../../../icons/pages/scenery/ParkingIcon.vue';
  import RestroomIcon from '../../../icons/pages/scenery/RestroomIcon.vue';
  import type { ScenerySpot } from '@/typesOfPages/travelGuide';
  import { computed } from 'vue';

  const props = defineProps<{
    spot: ScenerySpot;
  }>();

  const nearbyParsed = computed(() =>
    (props.spot?.nearbySpots ?? []).map((n) => {
      const m = n.match(/^(.+?)s+(d+(?:.d+)?)s*(?:km|公里)?$/i);
      return m
        ? { name: m[1].trim(), km: m[2], hasKm: true }
        : { name: n, km: '', hasKm: false };
    }),
  );

  const facilityIconMap: Record<string, unknown> = {
    '索道': CableCarIcon,
    '餐饮': RestaurantIcon,
    '住宿': HotelIcon,
    '停车场': ParkingIcon,
    '卫生间': RestroomIcon,
  };
</script>

<style scoped lang="scss" src="./index.scss" />
