<template>
  <div class="food-module">
    <template v-if="isLoading">
      <div class="food-loading">加载中...</div>
    </template>
    <template v-else>
      <Popular :popular-foods="popularFoods" />

      <Categories :all-foods="allFoods" />

      <FoodMap
        :food-map-locations="foodMapLocations"
        :all-foods="allFoods"
      />

      <Guide :guide="foodGuide" :all-foods="allFoods" />

      <Souvenir :souvenirs="foodSouvenirs" />

      <Seasonal :seasonal="foodSeasonal" :all-foods="allFoods" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import type { Food, FoodItem, FoodLocation, FoodGuide, FoodSouvenir, FoodSeasonal } from '@/typesOfPages/travelGuide/index.ts';
  import { useTravelGuideStore } from '@/stores/travelGuide';

  import Popular from './Popular/index.vue';
  import Categories from './Categories/index.vue';
  import FoodMap from './Map/index.vue';
  import Guide from './Guide/index.vue';
  import Souvenir from './Souvenir/index.vue';
  import Seasonal from './Seasonal/index.vue';

  const travelStore = useTravelGuideStore();

  const props = defineProps<{
    provinceId?: string;
  }>();

  const isLoading = ref(true);
  const rawFoods = ref<FoodItem[]>([]);
  const rawLocations = ref<FoodLocation[]>([]);
  const foodGuide = ref<FoodGuide | null>(null);
  const foodSouvenirs = ref<FoodSouvenir[]>([]);
  const foodSeasonal = ref<FoodSeasonal[]>([]);

  const allFoods = computed(() => {
    const result = rawFoods.value.map((food: FoodItem) => ({
      id: food.id,
      name: food.name,
      description: food.description,
      image: food.image,
      isPopular: food.isPopular,
      price: food.price,
      rating: food.rating,
      category: food.category,

      tags: food.tags || [],
      recommendations: food.recommendations
        ? {
            pairings: food.recommendations.pairings || [],
            eatingMethod: food.recommendations.eatingMethod || '',
          }
        : undefined,
      history: food.history,
      taste: food.taste,
      cookingMethod: food.cookingMethod,
      reviewCount: food.reviewCount,

    }));

    return result;
  });

  const popularFoods = computed(() => {
    const filtered = allFoods.value.filter((food: Food) => food.isPopular);
    return filtered;
  });

  const foodMapLocations = computed(() => {
    const foodById = new Map<string, Food>();
    for (const f of allFoods.value) foodById.set(f.id, f);

    const result = rawLocations.value.map((location: FoodLocation) => {
      let totalRating = 0;
      let count = 0;

      if (location.foods && location.foods.length > 0) {
        for (const foodId of location.foods) {
          const food = foodById.get(foodId);
          if (food && food.rating) {
            totalRating += food.rating;
            count++;
          }
        }
      }

      const averageRating =
        count > 0 ? parseFloat((totalRating / count).toFixed(1)) : 0;

      return {
        ...location,
        id: location.id || `${props.provinceId}-location-${location.name}`,
        rating: averageRating,
      };
    });
    return result;
  });

  watch(
    () => props.provinceId,
    async (newProvinceId) => {
      isLoading.value = true;
      const pid = newProvinceId || 'beijing';
      rawFoods.value = await travelStore.getFoodItems(pid);
      rawLocations.value = await travelStore.getFoodLocations(pid);
      foodGuide.value = await travelStore.getFoodGuide(pid);
      foodSouvenirs.value = await travelStore.getFoodSouvenirs(pid);
      foodSeasonal.value = await travelStore.getFoodSeasonal(pid);
      isLoading.value = false;
    },
    { immediate: true },
  );
</script>

<style scoped lang="scss" src="./index.scss" />
