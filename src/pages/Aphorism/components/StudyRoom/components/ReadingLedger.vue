<template>
  <div class="module-card reading-ledger">
    <span class="ledger-corner tl"></span>
    <span class="ledger-corner tr"></span>
    <span class="ledger-corner bl"></span>
    <span class="ledger-corner br"></span>
    <div class="module-header">
      <div class="ledger-heading">
        <span class="module-tag">阅读足迹</span>
        <div v-if="!readFootprintEmpty" class="ledger-counts">
          <span class="lc-item">
            <b>{{ footprintTotal }}</b>
            <i>首读过</i>
          </span>
          <span class="lc-divider"></span>
          <span class="lc-item">
            <b>{{ poetSegments.length }}</b>
            <i>位诗人</i>
          </span>
          <span class="lc-divider"></span>
          <span class="lc-item">
            <b>{{ dynastySegments.length }}</b>
            <i>个朝代</i>
          </span>
        </div>
      </div>
      <div v-if="!readFootprintEmpty" class="ledger-clear-actions">
        <button
          v-if="!confirmClearing"
          type="button"
          class="clear-btn"
          title="清空足迹"
          @click="startClear"
        >
          清空
        </button>
        <template v-else>
          <button type="button" class="clear-cancel-btn" @click="cancelClear">
            取消
          </button>
          <button
            type="button"
            class="clear-btn confirming"
            title="再次点击确认清空"
            @click="confirmClear"
          >
            确认清空
          </button>
        </template>
      </div>
    </div>

    <!-- 布面签条：切换账册分类 -->
    <div v-if="!readFootprintEmpty" class="ledger-tabs" role="tablist">
      <button
        v-for="t in readingTabs"
        :key="t.key"
        type="button"
        class="ledger-tab"
        :class="{ active: readingTab === t.key }"
        role="tab"
        :aria-selected="readingTab === t.key"
        @click="readingTab = t.key"
      >
        <span class="lt-string lt-top"></span>
        <span class="lt-label">{{ t.label }}</span>
        <span class="lt-string lt-bottom"></span>
      </button>
    </div>

    <div v-if="!readFootprintEmpty" class="module-body ledger-body">
      <!-- 签条页：每条足迹是一枚古籍题签（竖排大字 + 横排小注） -->
      <div class="ledger-page">
        <!-- 诗人签：常读诗人题签 -->
        <div v-if="readingTab === 'poet'" class="ledger-list tag-strip">
          <div
            v-for="(poet, idx) in poetSegments"
            :key="poet.name"
            class="ledger-row tag"
            :style="{ '--tag-cols': tagCols(poet.name, 4) }"
            @click="emit('search', poet.name)"
          >
            <span class="tag-no">{{ idx + 1 }}</span>
            <span class="tag-cord"></span>
            <span class="tag-text">{{ poet.name }}</span>
            <span class="tag-foot">
              {{ poet.dynasty }} · {{ poet.count }} 首
            </span>
          </div>
        </div>
        <!-- 朝代签：朝代题签 + 签内占比条 -->
        <div v-else-if="readingTab === 'dynasty'" class="ledger-list tag-strip">
          <div
            v-for="(seg, idx) in dynastySegments"
            :key="seg.name"
            class="ledger-row tag dyn-tag"
            :style="{ '--tag-cols': tagCols(seg.name, 4) }"
          >
            <span class="tag-no">{{ idx + 1 }}</span>
            <span class="tag-cord"></span>
            <span class="tag-text">{{ seg.name }}</span>
            <span class="tag-bar">
              <i
                :style="{ width: seg.percent + '%', background: seg.color }"
              ></i>
            </span>
            <span class="tag-foot">
              {{ seg.value }} 首 · {{ seg.percent }}%
            </span>
          </div>
        </div>
        <!-- 诗词签：读过的诗词题签 -->
        <div v-else class="ledger-list tag-strip poem-tags">
          <div
            v-for="(poem, idx) in readPoems"
            :key="poem.id"
            class="ledger-row tag"
            :style="{ '--tag-cols': tagCols(poem.title, 6) }"
            @click="emit('open', poem, getBackgroundUrl(poem.id))"
          >
            <span class="tag-no">{{ idx + 1 }}</span>
            <span class="tag-cord"></span>
            <span class="tag-text">{{ poem.title }}</span>
            <span class="tag-foot">{{ poem.dynasty }} · {{ poem.author }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="module-body module-empty">
      <FootprintIcon class="me-icon" />
      <p>打开诗词阅读后，自动记录你的诗人、朝代与诗词足迹</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onBeforeUnmount } from 'vue';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import { useAphorismInteractionStore } from '@/stores/aphorism/interaction';
  import FootprintIcon from '../../../icons/StudyRoom/FootprintIcon.vue';
  import { getBackgroundUrl } from '@/composables/aphorism/usePoemBackground';

  defineOptions({ name: 'ReadingLedger' });

  const props = defineProps<{ poems: Poem[] }>();
  const emit = defineEmits<{
    (e: 'open', poem: Poem, backgroundImage: string): void;
    (e: 'search', keyword: string): void;
  }>();

  const interactionStore = useAphorismInteractionStore();

  // ---- 足迹统计 ----
  const poetDynastyStats = computed(() =>
    interactionStore.getPoetAndDynastyStats(props.poems),
  );
  const dynastyDistribution = computed(() =>
    poetDynastyStats.value.dynasties.map((d) => ({
      name: d.name,
      value: d.count,
    })),
  );
  const favoritePoets = computed(() => poetDynastyStats.value.poets);

  const FOOTPRINT_COLORS = [
    '#ffd479',
    '#e0a63e',
    '#c9862a',
    '#f0c66a',
    '#b5701c',
    '#ffe3a4',
  ];
  const footprintTotal = computed(() =>
    dynastyDistribution.value.reduce((sum, d) => sum + d.value, 0),
  );
  const dynastySegments = computed(() => {
    const total = footprintTotal.value;
    let acc = 0;
    return dynastyDistribution.value.slice(0, 6).map((d, i) => {
      const start = total > 0 ? (acc / total) * 100 : 0;
      acc += d.value;
      const end = total > 0 ? (acc / total) * 100 : 0;
      return {
        ...d,
        percent: total > 0 ? Math.round((d.value / total) * 100) : 0,
        start,
        end,
        color: FOOTPRINT_COLORS[i % FOOTPRINT_COLORS.length],
      };
    });
  });

  const POET_RING_COLORS = [
    '#d4503f',
    '#a8302a',
    '#e8785c',
    '#8f201f',
    '#c44538',
    '#f09a7a',
  ];
  const poetSegments = computed(() => {
    const poets = favoritePoets.value.slice(0, 6);
    const total = poets.reduce((sum, p) => sum + p.count, 0);
    let acc = 0;
    return poets.map((p, i) => {
      const start = total > 0 ? (acc / total) * 100 : 0;
      acc += p.count;
      const end = total > 0 ? (acc / total) * 100 : 0;
      return {
        ...p,
        start,
        end,
        percent: total > 0 ? Math.round((p.count / total) * 100) : 0,
        color: POET_RING_COLORS[i % POET_RING_COLORS.length],
      };
    });
  });

  // ---- 读过的诗词：基于累积型 readIds，按最近打开顺序呈现 ----
  const readPoems = computed(() => {
    const map = new Map(props.poems.map((p) => [p.id, p]));
    return interactionStore.readIds
      .map((id) => map.get(id))
      .filter((p): p is Poem => p !== undefined);
  });

  type ReadingTab = 'poet' | 'dynasty' | 'poem';
  const readingTab = ref<ReadingTab>('poet');
  const readingTabs: { key: ReadingTab; label: string }[] = [
    { key: 'poet', label: '诗人' },
    { key: 'dynasty', label: '朝代' },
    { key: 'poem', label: '诗词' },
  ];

  const tagCols = (text: string | undefined, perColumn: number) => {
    const len = Array.from(text ?? '').length;
    return Math.min(3, Math.max(1, Math.ceil(len / perColumn)));
  };

  const readFootprintEmpty = computed(() => readPoems.value.length === 0);

  // ---- 清空足迹：内联二次确认，避免误点不可撤销 ----
  const confirmClearing = ref(false);
  let confirmResetTimer: number | null = null;

  const resetClearConfirm = () => {
    if (confirmResetTimer != null) {
      clearTimeout(confirmResetTimer);
      confirmResetTimer = null;
    }
    confirmClearing.value = false;
  };

  const startClear = () => {
    confirmClearing.value = true;
    if (confirmResetTimer != null) clearTimeout(confirmResetTimer);
    // 4 秒无操作自动退出确认态，避免长期暴露危险按钮
    confirmResetTimer = window.setTimeout(() => {
      confirmClearing.value = false;
      confirmResetTimer = null;
    }, 4000);
  };

  const cancelClear = () => resetClearConfirm();

  const confirmClear = () => {
    resetClearConfirm();
    interactionStore.clearRecentViews();
    interactionStore.clearRead();
  };

  onBeforeUnmount(() => {
    if (confirmResetTimer != null) clearTimeout(confirmResetTimer);
  });
</script>
