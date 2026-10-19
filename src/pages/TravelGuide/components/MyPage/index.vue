<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useMyData } from './useMyData';
  import { useMyPageState, type MainTab } from './useMyPageState';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import {
    FoodIcon,
    SceneryIcon,
  } from '@/pages/TravelGuide/icons/common';
  import MyFoodPanel from './MyFoodPanel/index.vue';
  import MySceneryPanel from './MySceneryPanel/index.vue';

  const {
    ensureStoreDataLoaded,
    foodEaten,
    foodWant,
    foodSouvenirWant,
    foodSouvenirBought,
    foodRouteFav,
    foodRouteDone,
    spotWant,
    spotBeen,

    experienceFavorites,
    experienceWant,
    experienceBeen,
    experiencesByCategory,
    routeDone,
    removeFoodEaten,
    removeFoodWant,
    removeFoodSouvenirWant,
    removeFoodSouvenirBought,
    removeFoodRouteFav,
    removeFoodRouteDone,
    removeSpotWant,
    removeSpotBeen,

    removeExperienceFavorite,
    removeExperienceWant,
    removeExperienceBeen,
  } = useMyData();

  onMounted(() => {
    ensureStoreDataLoaded();
  });

  const { show: showToast } = useTravelToast();

  const { mainTab, activeLeaf, expanded } = useMyPageState();

  interface Leaf {
    key: string;
    label: string;
    count: number;
  }
  interface SubBranch {
    key: string;
    label: string;
    leaves: Leaf[];
  }
  interface Branch {
    key: MainTab;
    label: string;
    icon: any;
    accent: string;
    subBranches: SubBranch[];
  }

  const expByCat = computed(() => experiencesByCategory.value);

  const tree = computed<Branch[]>(() => [
    {
      key: 'food',
      label: '美食',
      icon: FoodIcon,
      accent: 'cyan',
      subBranches: [
        {
          key: 'food',
          label: '美食',
          leaves: [
            { key: 'eaten', label: '已吃打卡', count: foodEaten.value.length },
            { key: 'want', label: '想吃清单', count: foodWant.value.length },
          ],
        },
        {
          key: 'souvenir',
          label: '伴手礼',
          leaves: [
            { key: 'souvenirWant', label: '想买', count: foodSouvenirWant.value.length },
            { key: 'souvenirBought', label: '已买', count: foodSouvenirBought.value.length },
          ],
        },
        {
          key: 'route',
          label: '美食路线',
          leaves: [
            { key: 'routeFav', label: '收藏', count: foodRouteFav.value.length },
            { key: 'routeDone', label: '已完成', count: foodRouteDone.value.length },
          ],
        },
      ],
    },
    {
      key: 'scenery',
      label: '风光',
      icon: SceneryIcon,
      accent: 'green',
      subBranches: [
        {
          key: 'spot',
          label: '景点',
          leaves: [
            { key: 'spotBeen', label: '已去过', count: spotBeen.value.length },
            { key: 'spotWant', label: '想去', count: spotWant.value.length },
          ],
        },
        {
          key: 'outdoor',
          label: '户外探险',
          leaves: [
            { key: 'outdoorFav', label: '已收藏', count: expByCat.value.outdoor?.favorites.length ?? 0 },
            { key: 'outdoorBeen', label: '已体验', count: expByCat.value.outdoor?.been.length ?? 0 },
          ],
        },
        {
          key: 'craft',
          label: '工坊体验',
          leaves: [
            { key: 'craftFav', label: '已收藏', count: expByCat.value.craft?.favorites.length ?? 0 },
            { key: 'craftBeen', label: '已体验', count: expByCat.value.craft?.been.length ?? 0 },
          ],
        },
        {
          key: 'performance',
          label: '演艺节目',
          leaves: [
            { key: 'performanceFav', label: '已收藏', count: expByCat.value.performance?.favorites.length ?? 0 },
            { key: 'performanceBeen', label: '已体验', count: expByCat.value.performance?.been.length ?? 0 },
          ],
        },
        {
          key: 'wellness',
          label: '休闲养生',
          leaves: [
            { key: 'wellnessFav', label: '已收藏', count: expByCat.value.wellness?.favorites.length ?? 0 },
            { key: 'wellnessBeen', label: '已体验', count: expByCat.value.wellness?.been.length ?? 0 },
          ],
        },
        {
          key: 'festival',
          label: '节庆日历',
          leaves: [
            { key: 'festivalFav', label: '已收藏', count: expByCat.value.festival?.favorites.length ?? 0 },
            { key: 'festivalBeen', label: '已体验', count: expByCat.value.festival?.been.length ?? 0 },
          ],
        },
      ],
    },
  ]);

  const branchTotal = (b: Branch): number =>
    b.subBranches.reduce((s, sub) => s + sub.leaves.reduce((ls, l) => ls + l.count, 0), 0);

  const toggleBranch = (key: MainTab): void => {
    expanded.value[key] = !expanded.value[key];
  };

  const selectLeaf = (main: MainTab, leafKey: string): void => {
    mainTab.value = main;
    activeLeaf.value = leafKey;
    expanded.value[main] = true;
  };

  const findName = <T extends { id: string; name: string }>(list: T[], id: string): string =>
    list.find((x) => x.id === id)?.name ?? '';

  const onRemoveFoodEaten = (id: string): void => {
    const name = findName(foodEaten.value, id);
    removeFoodEaten(id);
    showToast({ type: 'remove', message: `已移除「${name}」` });
  };
  const onRemoveFoodWant = (id: string): void => {
    const name = findName(foodWant.value, id);
    removeFoodWant(id);
    showToast({ type: 'remove', message: `已移除「${name}」` });
  };
  const onRemoveFoodSouvenirWant = (id: string): void => {
    const name = findName(foodSouvenirWant.value, id);
    removeFoodSouvenirWant(id);
    showToast({ type: 'remove', message: `已移除「${name}」` });
  };
  const onRemoveFoodSouvenirBought = (id: string): void => {
    const name = findName(foodSouvenirBought.value, id);
    removeFoodSouvenirBought(id);
    showToast({ type: 'remove', message: `已移除「${name}」` });
  };
  const onRemoveFoodRouteFav = (id: string): void => {
    const name = findName(foodRouteFav.value, id);
    removeFoodRouteFav(id);
    showToast({ type: 'remove', message: `已移除「${name}」` });
  };
  const onRemoveFoodRouteDone = (id: string): void => {
    const name = findName(foodRouteDone.value, id);
    removeFoodRouteDone(id);
    showToast({ type: 'remove', message: `已移除「${name}」` });
  };
  const onRemoveSpotWant = (id: string): void => {
    const name = findName(spotWant.value, id);
    removeSpotWant(id);
    showToast({ type: 'remove', message: `已移除「${name}」` });
  };
  const onRemoveSpotBeen = (id: string): void => {
    const name = findName(spotBeen.value, id);
    removeSpotBeen(id);
    showToast({ type: 'remove', message: `已移除「${name}」` });
  };
  const onRemoveRouteDone = (id: string): void => {
    const item = experienceBeen.value.find((x) => x.id === id);
    if (!item) return;
    removeExperienceBeen(id, (item as any).provinceId, (item as any).experienceCategory);
    showToast({ type: 'remove', message: `已移除「${item.name}」` });
  };
  const onRemoveExperienceFavorite = (id: string, provinceId: string, category: string): void => {
    const item = experienceFavorites.value.find((e: any) => e.id === id && e.provinceId === provinceId && e.experienceCategory === category);
    removeExperienceFavorite(id, provinceId, category);
    showToast({ type: 'remove', message: `已移除「${item?.name ?? ''}」` });
  };
  const onRemoveExperienceWant = (id: string, provinceId: string, category: string): void => {
    const item = experienceWant.value.find((e: any) => e.id === id && e.provinceId === provinceId && e.experienceCategory === category);
    removeExperienceWant(id, provinceId, category);
    showToast({ type: 'remove', message: `已移除「${item?.name ?? ''}」` });
  };
  const onRemoveExperienceBeen = (id: string, provinceId: string, category: string): void => {
    const item = experienceBeen.value.find((e: any) => e.id === id && e.provinceId === provinceId && e.experienceCategory === category);
    removeExperienceBeen(id, provinceId, category);
    showToast({ type: 'remove', message: `已移除「${item?.name ?? ''}」` });
  };
</script>

<template>
  <div class="my-page">
    <aside class="tree-nav">
      <div class="nav-header">
        <span class="nav-corner nav-corner-tl"></span>
        <span class="nav-corner nav-corner-tr"></span>
        <span class="nav-title">分类导航</span>
        <span class="nav-sub">CATEGORY · NAV</span>
        <span class="nav-glow"></span>
        <span class="nav-scan"></span>
      </div>
      <nav class="nav-tree">
        <div
          v-for="b in tree"
          :key="b.key"
          class="tree-branch"
          :class="[`branch-${b.accent}`, { active: mainTab === b.key, open: expanded[b.key] }]"
        >
          <button class="branch-head" @click="toggleBranch(b.key)">
            <span class="branch-bar"></span>
            <span class="branch-icon"><component :is="b.icon" :size="18" /></span>
            <span class="branch-label">{{ b.label }}</span>
            <span class="branch-count">
              <span class="count-num">{{ branchTotal(b) }}</span>
            </span>
            <span class="branch-caret"></span>
            <span class="branch-sheen"></span>
          </button>
          <div v-show="expanded[b.key]" class="branch-leaves">
            <span class="leaves-rail"></span>
            <div
              v-for="sub in b.subBranches"
              :key="sub.key"
              class="sub-branch-group"
            >
              <div class="sub-branch-label">{{ sub.label }}</div>
              <button
                v-for="leaf in sub.leaves"
                :key="leaf.key"
                class="leaf"
                :class="{ active: mainTab === b.key && activeLeaf === leaf.key }"
                @click="selectLeaf(b.key, leaf.key)"
              >
                <span class="leaf-node"></span>
                <span class="leaf-label">{{ leaf.label }}</span>
                <span class="leaf-count">{{ leaf.count }}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <main class="right-area">
      <div class="my-content">
        <MyFoodPanel
          v-if="mainTab === 'food'"
          :eaten="foodEaten"
          :want="foodWant"
          :souvenir-want="foodSouvenirWant"
          :souvenir-bought="foodSouvenirBought"
          :route-fav="foodRouteFav"
          :route-done="foodRouteDone"
          :active-sub="activeLeaf"
          @remove-eaten="onRemoveFoodEaten"
          @remove-want="onRemoveFoodWant"
          @remove-souvenir-want="onRemoveFoodSouvenirWant"
          @remove-souvenir-bought="onRemoveFoodSouvenirBought"
          @remove-route-fav="onRemoveFoodRouteFav"
          @remove-route-done="onRemoveFoodRouteDone"
        />
        <MySceneryPanel
          v-else-if="mainTab === 'scenery'"
          :spot-want="spotWant"
          :spot-been="spotBeen"
          :route-done="routeDone"
          :experience-favorites="experienceFavorites"
          :experience-want="experienceWant"
          :experience-been="experienceBeen"
          :experiences-by-category="experiencesByCategory"
          :active-sub="activeLeaf"
          @remove-spot-want="onRemoveSpotWant"
          @remove-spot-been="onRemoveSpotBeen"
          @remove-route-done="onRemoveRouteDone"
          @remove-experience-favorite="onRemoveExperienceFavorite"
          @remove-experience-want="onRemoveExperienceWant"
          @remove-experience-been="onRemoveExperienceBeen"
        />
      </div>
    </main>
  </div>
</template>

<style scoped src="./index.scss" lang="scss"></style>
