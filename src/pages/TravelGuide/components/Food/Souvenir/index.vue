<template>
  <section v-if="souvenirs.length > 0" class="souvenir-section">
    <div class="cabinet-aura"></div>

    <header class="cabinet-header">
      <div class="header-emblem">
        <div class="emblem-frame"></div>
        <ShoppingBagIcon class="emblem-icon" />
      </div>
      <div class="header-titles">
        <div class="title-tag">SOUVENIR CABINET</div>
        <h2 class="header-title">特产伴手礼</h2>
        <p class="header-subtitle">带什么回去 · 可购买的美味与指南</p>
      </div>
      <div class="header-meter">
        <div class="meter-ring">
          <span class="meter-count">{{ souvenirs.length }}</span>
        </div>
        <span class="meter-label">在册货品</span>
      </div>
    </header>

    <div class="cabinet-grid">
      <article
        v-for="(item, index) in souvenirs"
        :key="item.id"
        class="cabinet-card"
        :class="{
          'is-both': isWant(item.id) && isBought(item.id),
        }"
        :style="{ '--card-index': index }"
      >
        <!-- 切角边框层（科幻八边形） -->
        <div class="card-bevel"></div>
        <!-- 顶部数据流条（带刻度） -->
        <div class="card-datastream">
          <span v-for="t in 12" :key="t" class="stream-tick"></span>
        </div>
        <!-- 玻璃反光高光 -->
        <div class="card-glare"></div>

        <div class="card-visual">
          <img
            :src="item.image"
            :alt="item.name"
            class="visual-image"
            loading="lazy"
          />
          <div class="visual-glare"></div>
          <!-- HUD 取景框括号（四角 L 形） -->
          <span class="hud-bracket hud-tl"></span>
          <span class="hud-bracket hud-tr"></span>
          <span class="hud-bracket hud-bl"></span>
          <span class="hud-bracket hud-br"></span>
          <div class="info-price">{{ item.priceRange }}</div>
        </div>

        <div class="card-info">
          <div class="info-head">
            <h3 class="info-name">{{ item.name }}</h3>
            <span class="info-id">SPEC-{{ String(index + 1).padStart(3, '0') }}</span>
          </div>
          <p class="info-desc">{{ item.description }}</p>

          <div class="info-meta">
            <div class="meta-item">
              <span class="meta-label">
                <LocationIcon class="meta-icon" />
                购买
              </span>
              <span class="meta-value">{{ item.buyAt }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">
                <ClockIcon class="meta-icon" />
                保存
              </span>
              <span class="meta-value">{{ item.storage }}</span>
            </div>
          </div>

          <!-- 底部能量指示条 -->
          <div class="info-energy">
            <span
              v-for="e in 5"
              :key="e"
              class="energy-bar"
              :class="{ 'energy-active': e <= (index + 1) }"
            ></span>
          </div>

          <div class="info-actions">
            <button
              class="souvenir-action action-want"
              :class="{ 'is-active': isWant(item.id) }"
              @click.stop="handleToggleWant(item)"
            >
              <HeartIcon :size="14" :filled="isWant(item.id)" />
              <span>想买</span>
            </button>
            <button
              class="souvenir-action action-bought"
              :class="{ 'is-active': isBought(item.id) }"
              @click.stop="handleToggleBought(item)"
            >
              <ShoppingCartIcon :size="14" :filled="isBought(item.id)" />
              <span>已买</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
  import ShoppingBagIcon from '../../../icons/common/ShoppingBagIcon.vue';
  import ShoppingCartIcon from '../../../icons/common/ShoppingCartIcon.vue';
  import LocationIcon from '../../../icons/common/LocationIcon.vue';
  import ClockIcon from '../../../icons/common/ClockIcon.vue';
  import HeartIcon from '../../../icons/common/HeartIcon.vue';

  import type { FoodSouvenir } from '@/typesOfPages/travelGuide';
  import { useFoodSouvenirPrefs } from '@/composables/travelGuide/useFoodSouvenirPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';

  const { isWant, isBought, toggleWant, toggleBought } = useFoodSouvenirPrefs();
  const { show: showToast } = useTravelToast();

  const handleToggleWant = (item: FoodSouvenir) => {
    const wasWant = isWant(item.id);
    toggleWant(item.id);
    showToast({
      type: 'souvenir-want',
      message: wasWant ? `「${item.name}」已移出想买清单` : `「${item.name}」已收入想买清单`,
    });
  };

  const handleToggleBought = (item: FoodSouvenir) => {
    const wasBought = isBought(item.id);
    toggleBought(item.id);
    showToast({
      type: 'souvenir-bought',
      message: wasBought ? `已取消「${item.name}」的入手标记` : `已入手「${item.name}」`,
    });
  };

  interface Props {
    souvenirs: FoodSouvenir[];
  }

  withDefaults(defineProps<Props>(), {
    souvenirs: () => [],
  });
</script>

<style scoped lang="scss" src="./index.scss" />
