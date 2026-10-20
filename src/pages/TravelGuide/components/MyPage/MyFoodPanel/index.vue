<script lang="ts">
type SubTab =
  | 'eaten'
  | 'want'
  | 'souvenirWant'
  | 'souvenirBought'
  | 'routeFav'
  | 'routeDone';

const LINE_COLORS = [
  '#e63946', '#3a86ff', '#2a9d8f', '#f4a261',
  '#9b5de5', '#00bbf9', '#ff006e', '#fb5607',
] as const;

const EMPTY_TEXT_MAP: Record<SubTab, { title: string; hint: string }> = {
  eaten: { title: '还没有已吃打卡', hint: '在必吃清单点击"已吃"即可记录' },
  want: { title: '想吃清单是空的', hint: '在必吃清单点击"想吃"即可加入心愿单' },
  souvenirWant: { title: '想买的伴手礼是空的', hint: '在特产伴手礼页面点击"想买"即可加入' },
  souvenirBought: { title: '已买的伴手礼是空的', hint: '在特产伴手礼页面点击"已买"即可记录' },
  routeFav: { title: '还没有收藏的路线', hint: '在美食攻略路线点击收藏即可加入' },
  routeDone: { title: '还没有已完成的路线', hint: '在美食攻略路线点击完成即可记录' },
};
</script>

<script setup lang="ts">
import { computed, } from 'vue';
import { ElMessage } from 'element-plus';
import type { Food, FoodSouvenir, FoodGuideRoute } from '@/typesOfPages/travelGuide';
import MyEmpty from '../MyEmpty/index.vue';
import FoodDetailModal from '../../FoodDetailModal/index.vue';
import { useFoodDetail } from '../../FoodDetailModal/useFoodDetail';
import { useCheckin } from '../../FoodDetailModal/useCheckin';
import { useFoodSouvenirPrefs } from '@/composables/travelGuide/useFoodSouvenirPrefs';
import { useFoodRoutePrefs } from '@/composables/travelGuide/useFoodRoutePrefs';
import { useTravelGuideStore } from '@/stores/travelGuide';
import LacquerCard from './components/LacquerCard/index.vue';
import CapsuleCard from './components/CapsuleCard/index.vue';
import RouteMetroLine from './components/RouteMetroLine/index.vue';

const {
  detailVisible,
  detailFood,
  isThumbsUp,
  toggleThumbsUp,
  openDetail,
  closeDetail,
  toggleDetailThumbsUp,
  share,
} = useFoodDetail();

const detailThumbsUp = computed(() => detailFood.value ? isThumbsUp(detailFood.value) : false);

const { isWant, isEaten, toggleCheckin } = useCheckin();

const { isWant: isSouvenirWant, isBought: isSouvenirBought, toggleWant: toggleSouvenirWant, toggleBought: toggleSouvenirBought } = useFoodSouvenirPrefs();

const { isFavorited: isRouteFav, isCompleted: isRouteDone, toggleFavorited: toggleRouteFav, toggleCompleted: toggleRouteDone } = useFoodRoutePrefs();

const tgStore = useTravelGuideStore();
const foodName = (foodId: string): string => tgStore.foodNameMap[foodId] || '';


const handleSouvenirWant = (sv: FoodSouvenir): void => {
  const wasWant = isSouvenirWant(sv.id);
  toggleSouvenirWant(sv.id);
  if (wasWant) ElMessage.info(`已将「${sv.name}」移出想买清单`);
  else ElMessage.success(`「${sv.name}」已收入想买清单`);
};

const handleSouvenirBought = (sv: FoodSouvenir): void => {
  const wasBought = isSouvenirBought(sv.id);
  toggleSouvenirBought(sv.id);
  if (wasBought) ElMessage.info(`已取消「${sv.name}」的已买标记`);
  else ElMessage.success(`「${sv.name}」已入手`);
};

const handleThumbsUp = (food: Food): void => {
  const liked = isThumbsUp(food);
  toggleThumbsUp(food);
  ElMessage.success(liked ? '已取消点赞' : `已为「${food.name}」点赞`);
};

const handleWant = (food: Food): void => {
  const wasWant = isWant(food.id);
  toggleCheckin(food.id, 'want');
  if (wasWant) ElMessage.info(`已将「${food.name}」移出想吃清单`);
  else ElMessage.success(`「${food.name}」已收入想吃清单`);
};

const handleShare = async (food: Food): Promise<void> => {
  const ok = await share(food);
  if (ok) ElMessage.success('分享链接已复制到剪贴板');
  else ElMessage.warning('分享失败，请重试');
};

const handleEaten = (food: Food): void => {
  const wasEaten = isEaten(food.id);
  toggleCheckin(food.id, 'eaten');
  if (wasEaten) ElMessage.info(`已取消「${food.name}」的已吃标记`);
  else ElMessage.success(`「${food.name}」已品鉴`);
};

const handleDetailShare = (): void => {
  if (detailFood.value) share(detailFood.value);
};

const props = defineProps<{
  eaten: Food[];
  want: Food[];
  souvenirWant: FoodSouvenir[];
  souvenirBought: FoodSouvenir[];
  routeFav: FoodGuideRoute[];
  routeDone: FoodGuideRoute[];
  activeSub?: string;
}>();

const emit = defineEmits<{
  (e: 'remove-eaten', id: string): void;
  (e: 'remove-want', id: string): void;
  (e: 'remove-souvenir-want', id: string): void;
  (e: 'remove-souvenir-bought', id: string): void;
  (e: 'remove-route-fav', id: string): void;
  (e: 'remove-route-done', id: string): void;
}>();


const subTab = computed<SubTab>(() => {
  const v = props.activeSub;
  if (
    v === 'eaten' ||
    v === 'want' ||
    v === 'souvenirWant' ||
    v === 'souvenirBought' ||
    v === 'routeFav' ||
    v === 'routeDone'
  )
    return v;
  return 'want';
});

const isSouvenirTab = computed(
  () => subTab.value === 'souvenirWant' || subTab.value === 'souvenirBought',
);

const isRouteTab = computed(
  () => subTab.value === 'routeFav' || subTab.value === 'routeDone',
);

const currentList = computed<Food[]>(() => {
  if (subTab.value === 'eaten') return props.eaten;
  return props.want;
});

const currentSouvenirs = computed<FoodSouvenir[]>(() => {
  if (subTab.value === 'souvenirWant') return props.souvenirWant;
  return props.souvenirBought;
});

const currentRoutes = computed<FoodGuideRoute[]>(() => {
  if (subTab.value === 'routeFav') return props.routeFav;
  return props.routeDone;
});


const emptyText = computed(() => EMPTY_TEXT_MAP[subTab.value]);

const handleRemove = (id: string): void => {
  if (subTab.value === 'eaten') emit('remove-eaten', id);
  else if (subTab.value === 'want') emit('remove-want', id);
  else if (subTab.value === 'souvenirWant') emit('remove-souvenir-want', id);
  else if (subTab.value === 'souvenirBought') emit('remove-souvenir-bought', id);
  else if (subTab.value === 'routeFav') emit('remove-route-fav', id);
  else emit('remove-route-done', id);
};

const padNo = (n: number): string => String(n + 1).padStart(3, '0');

const handleRouteFav = (route: FoodGuideRoute): void => {
  const wasFav = isRouteFav(route.id);
  toggleRouteFav(route.id);
  if (wasFav) ElMessage.info(`已取消收藏「${route.name}」`);
  else ElMessage.success(`「${route.name}」已收藏`);
};

const handleRouteDone = (route: FoodGuideRoute): void => {
  const wasDone = isRouteDone(route.id);
  toggleRouteDone(route.id);
  if (wasDone) ElMessage.info(`已取消「${route.name}」的完成标记`);
  else ElMessage.success(`「${route.name}」已完成`);
};
</script>

<template>
  <div class="my-food-panel">
    <div class="panel-body">
      <MyEmpty v-if="!isSouvenirTab && !isRouteTab && currentList.length === 0" :title="emptyText.title"
        :hint="emptyText.hint" />
      <MyEmpty v-else-if="isSouvenirTab && currentSouvenirs.length === 0" :title="emptyText.title"
        :hint="emptyText.hint" />
      <MyEmpty v-else-if="isRouteTab && currentRoutes.length === 0" :title="emptyText.title" :hint="emptyText.hint" />

      <!-- ===== 朱红漆器食盒网格（美食卡片） ===== -->
      <LacquerCard
        v-else-if="!isSouvenirTab && !isRouteTab"
        :foods="currentList"
        :is-want="isWant"
        :is-eaten="isEaten"
        :is-thumbs-up="isThumbsUp"
        :pad-no="padNo"
        @open="openDetail"
        @remove="handleRemove"
        @thumbs-up="handleThumbsUp"
        @share="handleShare"
        @want="handleWant"
        @eaten="handleEaten"
      />

      <!-- ===== 伴手礼：太空储运舱段 ===== -->
      <CapsuleCard
        v-else-if="isSouvenirTab"
        :souvenirs="currentSouvenirs"
        :is-want="isSouvenirWant"
        :is-bought="isSouvenirBought"
        @remove="handleRemove"
        @want="handleSouvenirWant"
        @bought="handleSouvenirBought"
      />

      <!-- ===== 路线：换乘线路图 · 地铁线网 ===== -->
      <RouteMetroLine
        v-else
        :routes="currentRoutes"
        :is-fav="isRouteFav"
        :is-done="isRouteDone"
        :food-name="foodName"
        :line-colors="LINE_COLORS"
        @remove="handleRemove"
        @fav="handleRouteFav"
        @done="handleRouteDone"
      />
    </div>

    <FoodDetailModal :visible="detailVisible" :food="detailFood"
      :is-thumbs-up="detailThumbsUp" @close="closeDetail"
      @toggle-thumbs-up="toggleDetailThumbsUp" @share="handleDetailShare" />
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>
