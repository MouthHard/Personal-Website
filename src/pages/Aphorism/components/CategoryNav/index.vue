<template>
  <div class="category-nav">
    <!-- 加载中：分类骨架 -->
    <div v-if="isCatLoading" class="category-skeleton">
      <div class="sk-row">
        <span v-for="n in 6" :key="n" class="sk-tab"></span>
      </div>
      <div class="sk-row sub">
        <span v-for="m in 7" :key="m" class="sk-chip"></span>
      </div>
    </div>

    <!-- 加载失败 / 无分类 -->
    <div v-else-if="categories.length === 0" class="category-empty">
      <span class="ce-seal">类</span>
      <p class="ce-text">分类正在整卷中，请稍后再试</p>
      <button type="button" class="ce-retry" @click="retryLoadCategories">
        重试
      </button>
    </div>

    <template v-else>
      <!-- 竹简卷轴 -->
      <div class="scroll-wrap">
        <!-- 左端木轴 -->
        <div class="rod rod-left" aria-hidden="true">
          <span class="rod-cap top"></span>
          <span class="rod-cap bottom"></span>
          <span class="rod-ring top"></span>
          <span class="rod-ring bottom"></span>
          <span class="rod-stud"></span>
          <span class="rod-label">诗</span>
        </div>

        <!-- 竹简展开区 -->
        <div class="scroll-content">
          <!-- 上韦编 -->
          <span class="cord cord-top" aria-hidden="true">
            <span v-for="k in 9" :key="k" class="cord-knot"></span>
          </span>
          <!-- 下韦编 -->
          <span class="cord cord-bottom" aria-hidden="true">
            <span v-for="k in 9" :key="k" class="cord-knot"></span>
          </span>

          <!-- 主分类竹简（上排） -->
          <div class="category-tabs">
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="category-tab"
              :class="{ active: activeCategory === category.id }"
              @click="selectCategory(category)"
            >
              <span class="tab-hole top left" aria-hidden="true"></span>
              <span class="tab-hole top right" aria-hidden="true"></span>
              <span class="tab-hole bottom left" aria-hidden="true"></span>
              <span class="tab-hole bottom right" aria-hidden="true"></span>
              <span class="tab-grain" aria-hidden="true"></span>
              <component :is="getIconComponent(category.id)" class="tab-icon" />
              <span class="tab-name">{{ category.name }}</span>
              <span class="tab-glow" aria-hidden="true"></span>
            </button>
          </div>

          <!-- 卷轴中分丝带 -->
          <div class="scroll-divider" aria-hidden="true">
            <span class="divider-tassel left"></span>
            <span class="divider-ribbon"></span>
            <span class="divider-tassel right"></span>
          </div>

          <!-- 子分类竹简（下排） -->
          <div v-if="subCategories.length > 0" class="category-grid">
            <button
              v-for="sub in subCategories"
              :key="sub.id"
              type="button"
              class="category-item sub-category"
              :class="{ active: activeSubCategory === sub.id }"
              @click="selectSubCategory(sub)"
            >
              <span class="item-hole top left" aria-hidden="true"></span>
              <span class="item-hole top right" aria-hidden="true"></span>
              <span class="item-hole bottom left" aria-hidden="true"></span>
              <span class="item-hole bottom right" aria-hidden="true"></span>
              <span class="item-grain" aria-hidden="true"></span>
              <span class="item-name">{{ sub.name }}</span>
              <span class="item-glow" aria-hidden="true"></span>
            </button>
          </div>
        </div>

        <!-- 右端木轴 -->
        <div class="rod rod-right" aria-hidden="true">
          <span class="rod-cap top"></span>
          <span class="rod-cap bottom"></span>
          <span class="rod-ring top"></span>
          <span class="rod-ring bottom"></span>
          <span class="rod-stud"></span>
          <span class="rod-label">卷</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useAphorismDataStore } from '@/stores/aphorism';
  import type { CategoryGroup, CategoryChild } from '@/services/aphorism';
  import DynastyIcon from '@/pages/Aphorism/icons/common/DynastyIcon.vue';
  import EmotionIcon from '@/pages/Aphorism/icons/common/EmotionIcon.vue';
  import FormIcon from '@/pages/Aphorism/icons/common/FormIcon.vue';
  import SchoolIcon from '@/pages/Aphorism/icons/common/SchoolIcon.vue';
  import SubjectIcon from '@/pages/Aphorism/icons/common/SubjectIcon.vue';
  import UsageIcon from '@/pages/Aphorism/icons/common/UsageIcon.vue';
  import './index.scss';

  const emit = defineEmits<{
    (e: 'category-change', categoryId: string, subCategoryId?: number): void;
  }>();

  const dataStore = useAphorismDataStore();
  const activeCategory = ref<string>('');
  const activeSubCategory = ref<number | null>(null);
  const hasAutoSelected = ref(false);

  const iconComponents: Record<string, any> = {
    dynasty: DynastyIcon,
    emotion: EmotionIcon,
    form: FormIcon,
    school: SchoolIcon,
    subject: SubjectIcon,
    usage: UsageIcon,
  };

  const getIconComponent = (categoryId: string) => {
    return iconComponents[categoryId] || null;
  };

  const categories = computed<CategoryGroup[]>(() => dataStore.categories);

  const subCategories = computed<CategoryChild[]>(() => {
    if (!activeCategory.value) return [];
    const category = categories.value.find(
      (c) => c.id === activeCategory.value,
    );
    return category?.children || [];
  });

  const handleCategorySelection = (
    categoryId: string,
    subCategoryId?: number,
  ) => {
    emit('category-change', categoryId, subCategoryId);
  };

  const selectCategory = (category: CategoryGroup) => {
    hasAutoSelected.value = true;
    activeCategory.value = category.id;
    activeSubCategory.value = null;
    const firstSub = category.children?.[0];
    if (firstSub) {
      activeSubCategory.value = firstSub.id;
      const subId = firstSub.name === '全部诗词' ? undefined : firstSub.id;
      handleCategorySelection(category.id, subId);
    } else {
      handleCategorySelection(category.id);
    }
  };

  const selectSubCategory = (sub: CategoryChild) => {
    hasAutoSelected.value = true;
    activeSubCategory.value = sub.id;
    const subId = sub.name === '全部诗词' ? undefined : sub.id;
    handleCategorySelection(activeCategory.value, subId);
  };

  const reset = () => {
    activeCategory.value = '';
    activeSubCategory.value = null;
    hasAutoSelected.value = true;
  };

  // 外部（URL query 消费）按「组 id + 子类名」指定选中态，同步 Tab 高亮。
  // 分类可能尚未加载完：记入 pending，categories 就绪后由 watch 重试。
  let pendingQuerySelect: { groupId: string; subName?: string } | null = null;

  const applyQuerySelect = (groupId: string, subName?: string) => {
    hasAutoSelected.value = true;
    activeCategory.value = groupId;
    const children =
      categories.value.find((c) => c.id === groupId)?.children ?? [];
    const sub = subName
      ? children.find((c) => c.name === subName)
      : children.find((c) => c.name === '全部诗词');
    activeSubCategory.value = sub?.id ?? children[0]?.id ?? null;
  };

  const selectByNames = (groupId: string, subName?: string) => {
    const cat = categories.value.find((c) => c.id === groupId);
    if (!cat) {
      pendingQuerySelect = { groupId, subName };
      return;
    }
    applyQuerySelect(groupId, subName);
  };

  watch(categories, (cats) => {
    if (pendingQuerySelect && cats.length > 0) {
      const pending = pendingQuerySelect;
      pendingQuerySelect = null;
      applyQuerySelect(pending.groupId, pending.subName);
    }
  });

  const selectAllOfCurrentCategory = () => {
    const category = categories.value.find(
      (c) => c.id === activeCategory.value,
    );
    const children = category?.children ?? [];
    const allSub = children.find((c) => c.name === '全部诗词') ?? children[0];
    if (allSub) {
      selectSubCategory(allSub);
    } else {
      hasAutoSelected.value = true;
      activeSubCategory.value = null;
      handleCategorySelection(activeCategory.value || '');
    }
  };

  defineExpose({ reset, selectAllOfCurrentCategory, selectByNames });

  const isCatLoading = ref(false);

  const loadCategories = async () => {
    isCatLoading.value = true;
    try {
      await dataStore.loadCategories();
    } finally {
      isCatLoading.value = false;
    }
  };

  const retryLoadCategories = () => {
    loadCategories();
  };

  onMounted(async () => {
    if (categories.value.length === 0) {
      await loadCategories();
    }
  });

  watch(
    () => [dataStore.poems.length, categories.value.length] as const,
    ([poemLen, catLen]) => {
      if (poemLen > 0 && catLen > 0 && !hasAutoSelected.value) {
        selectCategory(categories.value[0]);
      }
    },
    { immediate: true },
  );
</script>
