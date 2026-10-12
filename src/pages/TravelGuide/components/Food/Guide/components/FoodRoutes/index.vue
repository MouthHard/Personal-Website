<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Food, FoodGuideRoute } from '@/typesOfPages/travelGuide';
import MapIcon from '../../../../../icons/common/MapIcon.vue';
import ClockIcon from '../../../../../icons/common/ClockIcon.vue';
import HeartIcon from '../../../../../icons/common/HeartIcon.vue';
import FlagIcon from '../../../../../icons/common/FlagIcon.vue';
import ChevronRightIcon from '../../../../../icons/common/ChevronRightIcon.vue';
import { useFoodRoutePrefs } from '@/composables/travelGuide/useFoodRoutePrefs';
import { useTravelToast } from '@/composables/travelGuide/useTravelToast';

const props = defineProps<{
  routes: FoodGuideRoute[];
  allFoods: Food[];
}>();

const { isFavorited, isCompleted, toggleFavorited, toggleCompleted } = useFoodRoutePrefs();
const { show: showToast } = useTravelToast();

const foodMap = computed(() => {
  const m = new Map<string, Food>();
  for (const f of props.allFoods) m.set(f.id, f);
  return m;
});

const getFoodName = (foodId: string) =>
  foodMap.value.get(foodId)?.name || '未知美食';

const expandedRoutes = ref<Set<string>>(new Set());

const toggleRoute = (routeId: string) => {
  const next = new Set(expandedRoutes.value);
  if (next.has(routeId)) next.delete(routeId);
  else next.add(routeId);
  expandedRoutes.value = next;
};

const handleToggleFavorited = (routeId: string, name: string) => {
  const wasFav = isFavorited(routeId);
  toggleFavorited(routeId);
  showToast({
    type: 'route-fav',
    message: wasFav ? `已取消收藏「${name}」` : `已收藏「${name}」`,
  });
};

const handleToggleCompleted = (routeId: string, name: string) => {
  const wasDone = isCompleted(routeId);
  toggleCompleted(routeId);
  showToast({
    type: 'route-done',
    message: wasDone ? `已取消「${name}」的完成标记` : `已完成「${name}」全程`,
  });
};

const getRouteFoodTags = (route: { steps: { foodId: string }[] }): string[] => {
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const step of route.steps) {
    if (!seen.has(step.foodId)) {
      seen.add(step.foodId);
      tags.push(getFoodName(step.foodId));
    }
  }
  return tags;
};
</script>

<template>
  <section v-if="routes.length > 0" class="guide-block routes-block">
    <h3 class="block-title">
      <MapIcon class="title-icon" />
      <span>美食路线</span>
    </h3>
    <div class="routes-list">
      <article
        v-for="route in routes"
        :key="route.id"
        class="portal-console"
        :class="{
          collapsed: !expandedRoutes.has(route.id),
          'is-both': isFavorited(route.id) && isCompleted(route.id),
        }"
      >
        <div class="console-header">
          <h4 class="console-name">{{ route.name }}</h4>
          <div class="console-duration">
            <ClockIcon class="duration-icon" />
            <span>{{ route.duration }}</span>
          </div>
          <div class="route-actions" @click.stop>
            <button
              class="route-action route-fav"
              :class="{ active: isFavorited(route.id) }"
              aria-label="收藏路线"
              @click="handleToggleFavorited(route.id, route.name)"
            >
              <HeartIcon class="route-action-icon" :filled="isFavorited(route.id)" />
            </button>
            <button
              class="route-action route-done"
              :class="{ active: isCompleted(route.id) }"
              aria-label="标记已完成"
              @click="handleToggleCompleted(route.id, route.name)"
            >
              <FlagIcon class="route-action-icon" :filled="isCompleted(route.id)" />
            </button>
          </div>
          <button
            class="route-toggle"
            :aria-label="expandedRoutes.has(route.id) ? '收起' : '展开'"
            @click.stop="toggleRoute(route.id)"
          >
            <span class="toggle-text">{{ expandedRoutes.has(route.id) ? '收起' : '展开' }}</span>
            <ChevronRightIcon class="toggle-chevron" :size="16" :stroke-width="2.5" />
          </button>
        </div>
        <div v-if="!expandedRoutes.has(route.id)" class="route-tags-row">
          <span
            v-for="tag in getRouteFoodTags(route)"
            :key="tag"
            class="route-food-tag"
          >{{ tag }}</span>
        </div>
        <div v-else class="portal-chain">
          <div
            v-for="(step, i) in route.steps"
            :key="`${step.foodId}-${step.time}-${i}`"
            class="portal-node"
          >
            <div class="portal-row">
              <div class="portal-gate">
                <div class="gate-energy"></div>
                <div class="gate-id">{{ i + 1 }}</div>
              </div>
              <div class="portal-data">
                <div class="data-time">{{ step.time }}</div>
                <div class="data-location">{{ step.location }}</div>
                <div class="data-payload">{{ getFoodName(step.foodId) }}</div>
                <p class="data-brief">{{ step.description }}</p>
              </div>
            </div>
            <div v-if="i < route.steps.length - 1" class="quantum-tunnel">
              <div class="tunnel-flow"></div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss" src="./index.scss" />