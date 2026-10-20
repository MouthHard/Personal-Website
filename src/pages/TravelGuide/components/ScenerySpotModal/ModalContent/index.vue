<template>
  <div class="modal-content">
    <!-- 标题区 -->
    <header class="modal-header">
      <h2 class="modal-name">{{ spot.name }}</h2>
      <div v-if="spot.rankBadge" class="modal-rank">{{ spot.rankBadge }}</div>
    </header>

    <!-- 基本信息 -->
    <section class="modal-section meta-section">
      <h3 class="section-title">
        <span class="section-num">01</span>
        <LocationIcon width="15" height="15" />
        <span>基本信息</span>
      </h3>
      <div class="info-terminal">
        <div v-if="spot.location" class="info-strip">
          <span class="strip-port"><LocationIcon width="16" height="16" /></span>
          <span class="strip-label">坐标</span>
          <span class="strip-value">{{ spot.location }}</span>
          <span class="strip-line"></span>
        </div>
        <div v-if="spot.distance" class="info-strip">
          <span class="strip-port"><MapIcon width="16" height="16" /></span>
          <span class="strip-label">距离</span>
          <span class="strip-value">{{ spot.distance }}</span>
          <span class="strip-line"></span>
        </div>
        <div v-if="spot.bestTime" class="info-strip">
          <span class="strip-port"><CalendarIcon width="16" height="16" /></span>
          <span class="strip-label">最佳季节</span>
          <span class="strip-value">{{ spot.bestTime }}</span>
          <span class="strip-line"></span>
        </div>
        <div v-if="spot.openTime" class="info-strip is-time">
          <span class="strip-port"><ClockIcon width="16" height="16" /></span>
          <span class="strip-label">开放时间</span>
          <span class="strip-value">{{ spot.openTime }}</span>
          <span class="strip-line"></span>
          <div v-if="spot.openTimeDetail?.length" class="time-expand">
            <div
              v-for="(t, i) in spot.openTimeDetail"
              :key="i"
              class="time-row"
            >
              <span class="time-dot"></span>
              <span class="time-text">{{ t.season }}<template v-if="t.months">（{{ t.months }}）</template> {{ t.time }}</span>
            </div>
          </div>
        </div>
        <div v-if="spot.visitDuration" class="info-strip">
          <span class="strip-port"><SunIcon width="16" height="16" /></span>
          <span class="strip-label">建议时长</span>
          <span class="strip-value">{{ spot.visitDuration }}</span>
          <span class="strip-line"></span>
        </div>
        <div v-if="spot.rating" class="info-strip">
          <span class="strip-port"><FireIcon width="16" height="16" /></span>
          <span class="strip-label">热度</span>
          <span class="strip-value">{{ '★'.repeat(Math.round(spot.rating)) }}{{ '☆'.repeat(5 - Math.round(spot.rating)) }}</span>
          <span class="strip-line"></span>
        </div>
      </div>
    </section>

    <!-- 景点简介 -->
    <section v-if="spot.description || spot.highlight" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">02</span>
        <ScrollIcon width="15" height="15" />
        <span>景点简介</span>
      </h3>
      <div class="brief-card">

        <div v-if="spot.highlight" class="brief-quote">
          <span class="quote-icon">"</span>
          <span class="quote-text">{{ spot.highlight }}</span>
        </div>
        <p v-if="spot.description" class="brief-body">{{ spot.description }}</p>
      </div>
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
      <div class="ticket-board">
        <div
          v-for="(t, i) in ticketParsed"
          :key="i"
          class="ticket-card"
          :class="`tk-${i % 4}`"
        >
          <div class="ticket-body">
            <span class="tk-label">Ticket</span>
            <span class="tk-content">{{ t.main }}</span>
          </div>
          <span class="tk-perf"></span>
          <div class="ticket-stub">
            <span v-if="t.price" class="tk-price">{{ t.price }}</span>
            <span v-else class="tk-no">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="tk-bar"></span>
          </div>
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
      <div class="transit-board">
        <div
          v-for="(t, i) in spot.transportInfo"
          :key="i"
          class="transit-sign"
          :class="`ts-${i % 4}`"
        >
          <span class="ts-badge">{{ t.mode }}</span>
          <span class="ts-arrow">▶</span>
          <span class="ts-text">{{ t.detail }}</span>
        </div>
      </div>
    </section>

    <!-- 推荐游览路线 -->
    <section v-if="spot.recommendedRoutes?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">08</span>
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
            <div class="route-head">
              <h4 class="route-name">{{ r.name }}</h4>
              <div class="route-stats">
                <span class="stat-chip stat-time">
                  <ClockIcon width="13" height="13" />
                  {{ r.duration }}
                </span>
                <span class="stat-chip stat-diff">
                  <FireIcon width="13" height="13" />
                  {{ r.difficulty }}
                </span>
                <span v-if="r.budget" class="stat-chip stat-budget">
                  <ShoppingBagIcon width="13" height="13" />
                  {{ r.budget.currency }}{{ r.budget.min }}-{{ r.budget.max }}
                </span>
              </div>
            </div>

            <div v-if="r.itinerary?.length" class="route-itinerary">
              <div
                v-for="(it, j) in r.itinerary"
                :key="j"
                class="itinerary-item"
              >
                <span class="itinerary-day">{{ it.day }}</span>
                <div class="itinerary-content">
                  <span class="itinerary-title">{{ it.title }}</span>
                  <div class="itinerary-path">
                    <template
                      v-for="(node, k) in it.detail.split('→')"
                      :key="k"
                    >
                      <span class="path-node">{{ node.trim() }}</span>
                      <span
                        v-if="k < it.detail.split('→').length - 1"
                        class="path-arrow"
                      >→</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="r.bestFor?.length" class="route-bestfor">
              <CheckIcon width="14" height="14" />
              <span>{{ r.bestFor.join(' / ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 景区设施 -->
    <section v-if="spot.facilities?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">09</span>
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
        <span class="section-num">10</span>
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
        <span class="section-num">11</span>
        <PictureIcon width="15" height="15" />
        <span>最佳拍照点</span>
      </h3>
      <div class="photo-wall">
        <div
          v-for="(p, i) in spot.photoSpots"
          :key="i"
          class="polaroid-slot"
          :class="`ps-${i % 4}`"
        >
          <span class="slot-screw sl"></span>
          <span class="slot-screw sr"></span>
          <div class="polaroid">
            <div class="polaroid-photo">
              <img v-if="p.image" :src="p.image" :alt="p.name" class="polaroid-img" loading="lazy" />
              <span class="photo-id">F{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <div class="polaroid-label">{{ p.name }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 周边联游 -->
    <section v-if="spot.nearbySpots?.length" class="modal-section">
      <h3 class="section-title">
        <span class="section-num">12</span>
        <SceneryIcon width="15" height="15" />
        <span>周边联游</span>
      </h3>
      <div class="radar-station">
        <!-- 左：雷达 CRT 屏 -->
        <div class="radar-crt">
          <span class="crt-screw tl"></span>
          <span class="crt-screw tr"></span>
          <span class="crt-screw bl"></span>
          <span class="crt-screw br"></span>
          <div class="crt-bezel">
            <svg class="crt-bezel-marks" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
              <g v-for="a in 72" :key="a" :transform="`rotate(${a * 5} 150 150)`">
                <line
                  x1="148" y1="10"
                  :x2="148"
                  :y2="a % 6 === 0 ? 18 : 14"
                  class="bezel-tick"
                  :class="{ 'bezel-tick-major': a % 6 === 0 }"
                />
              </g>
              <text x="150" y="8" class="bezel-compass" text-anchor="middle">N</text>
              <text x="294" y="154" class="bezel-compass" text-anchor="middle">E</text>
              <text x="150" y="298" class="bezel-compass" text-anchor="middle">S</text>
              <text x="6" y="154" class="bezel-compass" text-anchor="middle">W</text>
            </svg>
            <div class="crt-screen">
              <svg class="radar-grid" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="rg-sweep-grad" x1="0%" y1="0%" x2="100%" y2="50%">
                    <stop offset="0%" stop-color="#ffaa00" stop-opacity="0.45" />
                    <stop offset="60%" stop-color="#ffaa00" stop-opacity="0.12" />
                    <stop offset="100%" stop-color="#ffaa00" stop-opacity="0" />
                  </linearGradient>
                  <radialGradient id="rg-screen-grad" cx="42%" cy="38%" r="65%">
                    <stop offset="0%" stop-color="#1a1208" stop-opacity="0.5" />
                    <stop offset="100%" stop-color="#000000" stop-opacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="150" cy="150" r="138" class="rg-ring rg-ring-outer" />
                <circle cx="150" cy="150" r="104" class="rg-ring rg-ring-mid" />
                <circle cx="150" cy="150" r="70" class="rg-ring rg-ring-inner" />
                <circle cx="150" cy="150" r="36" class="rg-ring rg-ring-core" />
                <line x1="12" y1="150" x2="288" y2="150" class="rg-axis" />
                <line x1="150" y1="12" x2="150" y2="288" class="rg-axis" />
                <line x1="52" y1="52" x2="248" y2="248" class="rg-axis rg-axis-diag" />
                <line x1="248" y1="52" x2="52" y2="248" class="rg-axis rg-axis-diag" />
                <g class="rg-sweep">
                  <path d="M150,150 L150,12 A138,138 0 0,1 248,52 Z" class="rg-sweep-fill" />
                  <line x1="150" y1="150" x2="150" y2="12" class="rg-sweep-line" />
                </g>
                <text x="156" y="118" class="rg-label">{{ radarLabels[0] }}km</text>
                <text x="156" y="84" class="rg-label">{{ radarLabels[1] }}km</text>
                <text x="156" y="50" class="rg-label">{{ radarLabels[2] }}km</text>
                <rect x="0" y="0" width="300" height="300" fill="url(#rg-screen-grad)" />
              </svg>
              <div class="radar-center">
                <span class="rc-core"></span>
                <span class="rc-pulse"></span>
              </div>
              <div
                v-for="(pt, i) in radarPoints"
                :key="i"
                class="radar-blip"
                :class="{
                  'blip-ghost': !pt.hasKm,
                  'blip-active': activeBlip === i
                }"
                :style="{ left: pt.x + '%', top: pt.y + '%' }"
                @mouseenter="activeBlip = i"
                @mouseleave="activeBlip = null"
              >
                <span class="blip-dot"></span>
                <span class="blip-wave"></span>
                <span class="blip-cross"></span>
                <div class="blip-tag">
                  <span class="bt-name">{{ pt.name }}</span>
                  <span v-if="pt.hasKm" class="bt-dist">{{ pt.km }} km</span>
                </div>
              </div>
              <div class="radar-hud">
                <span class="hud-led"></span>
                <span class="hud-text">SCAN</span>
                <span class="hud-count">{{ radarPoints.length }} TGT</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右：雷达机器按钮面板 -->
        <div class="radar-panel">
          <div class="panel-header">
            <span class="ph-led"></span>
            <span class="ph-title">DETECTION LIST</span>
          </div>
          <div class="panel-list">
            <button
              v-for="(pt, i) in radarPoints"
              :key="i"
              class="panel-btn"
              :class="{ 'pb-active': activeBlip === i }"
              @mouseenter="activeBlip = i"
              @mouseleave="activeBlip = null"
            >
              <span class="pb-led"></span>
              <span class="pb-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="pb-name">{{ pt.name }}</span>
              <span class="pb-dist">
                <span class="pb-km">{{ pt.hasKm ? pt.km : '--' }}</span>
                <span class="pb-unit">{{ pt.hasKm ? 'km' : '' }}</span>
              </span>
              <span class="pb-bracket"></span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 季节指南 — 四季连票车票 -->
    <section v-if="spot.seasonalGuide?.length" class="modal-section season-section">
      <h3 class="section-title">
        <span class="section-num">13</span>
        <CalendarIcon width="15" height="15" />
        <span>季节指南</span>
      </h3>
      <div class="season-tickets">
        <div
          v-for="(s, i) in spot.seasonalGuide"
          :key="i"
          class="ticket"
          :class="`ticket-${['spring', 'summer', 'autumn', 'winter'][i] || 'other'}`"
        >
          <div class="ticket-stub">
            <span class="stub-line">季节专列</span>
            <span class="stub-glyph">{{ ['春', '夏', '秋', '冬'][i] || '·' }}</span>
            <span class="stub-no">No.{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div class="ticket-perf"></div>
          <div class="ticket-body">
            <div class="ticket-head">
              <span class="ticket-season">{{ ['春', '夏', '秋', '冬'][i] || '·' }}季指南</span>
              <span class="ticket-meta">二〇二六·{{ ['春', '夏', '秋', '冬'][i] || '·' }}</span>
            </div>
            <span class="ticket-desc">{{ s }}</span>
            <div class="ticket-foot">
              <span class="ticket-bar"></span>
              <span class="ticket-seal">{{ ['春', '夏', '秋', '冬'][i] || '·' }}</span>
            </div>
          </div>
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
  import { computed, ref } from 'vue';

  const props = defineProps<{
    spot: ScenerySpot;
  }>();

  const activeBlip = ref<number | null>(null);

  const nearbyParsed = computed(() =>
    (props.spot?.nearbySpots ?? []).map((n) => {
      const m = n.match(/^(.+?)\s+(\d+(?:\.\d+)?)\s*(?:km|公里)?$/i);
      return m
        ? { name: m[1].trim(), km: m[2], hasKm: true }
        : { name: n, km: '', hasKm: false };
    }),
  );

  const radarMaxKm = computed(() => {
    const kms = nearbyParsed.value
      .filter((it) => it.hasKm)
      .map((it) => parseFloat(it.km));
    return kms.length ? Math.max(...kms) : 0;
  });

  const radarLabels = computed(() => {
    const max = radarMaxKm.value;
    if (max <= 0) return ['', '', ''];
    const fmt = (v: number) => (v >= 10 ? Math.round(v).toString() : v.toFixed(1));
    return [fmt(max * 0.5), fmt(max), fmt(max * 1.5)];
  });

  const radarPoints = computed(() => {
    const items = nearbyParsed.value;
    const n = items.length;
    if (n === 0) return [];
    const max = radarMaxKm.value || 1;
    const radarMax = max * 2;
    return items.map((it, i) => {
      const angle = (360 / n) * i - 90;
      const rad = (angle * Math.PI) / 180;
      const kmVal = it.hasKm ? parseFloat(it.km) : max * 0.5;
      const rPct = 6 + (kmVal / radarMax) * 38;
      const x = 50 + rPct * Math.sin(rad);
      const y = 50 - rPct * Math.cos(rad);
      return { ...it, x, y };
    });
  });

  const ticketParsed = computed(() =>
    (props.spot?.ticketDetails ?? []).map((t) => {
      if (typeof t === 'object' && t !== null) return { main: t.type || '', price: t.price || '' };
      return { main: String(t), price: '' };
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
