<template>
  <section class="wellness-retreat">
    <div v-if="items && items.length > 0" class="tea-stand">
      <!-- ============ 分类器物台（分类 tab，含"全部"） ============ -->
      <div class="artifact-bar">
        <span class="bar-grain"></span>
        <button
          class="artifact artifact-all"
          :class="{ active: selectedSub === null }"
          @click="selectAll"
        >
          <span class="pedestal">
            <span class="pedestal-rim"></span>
            <LeafIcon :size="38" class="pedestal-icon" />
          </span>
          <span class="artifact-label">全部</span>
          <span class="artifact-count">{{ (props.items || []).length }}</span>
        </button>
        <button
          v-for="s in SUBTYPES"
          :key="s.key"
          class="artifact"
          :class="{ active: selectedSub === s.key, disabled: subCount(s.key) === 0 }"
          :style="{ '--sub-color': s.color, animationDelay: `${SUBTYPES.indexOf(s) * 0.05}s` }"
          :disabled="subCount(s.key) === 0"
          @click="toggleSub(s.key)"
        >
          <span class="pedestal">
            <span class="pedestal-rim"></span>
            <component :is="s.icon" :size="38" class="pedestal-icon" />
          </span>
          <span class="artifact-label">{{ s.label }}</span>
          <span v-if="subCount(s.key) > 0" class="artifact-count">{{ subCount(s.key) }}</span>
        </button>
      </div>

      <!-- ============ 左右两栏：左卡片列表 + 右详情 ============ -->
      <div class="main-split">
        <!-- 左栏：项目卡片列表 -->
        <div class="left-pane">
          <div v-if="filteredItems.length > 0" class="item-cards">
            <button
              v-for="(item, index) in filteredItems"
              :key="item.id || index"
              class="item-card"
              :class="{ active: activeIndex === index }"
              :style="{ '--sub-color': subtype(item).color, animationDelay: `${index * 0.04}s` }"
              @click="select(index)"
            >
              <span class="card-img-wrap">
                <img loading="lazy" :src="item.image" :alt="item.name" class="card-img" />
                <span v-if="item.heritageLevel" class="card-seal">{{ heritageShort[item.heritageLevel] || '非遗' }}</span>
              </span>
              <span class="card-info">
                <span class="card-name">{{ item.name }}</span>
                <span class="card-tags">
                  <span class="card-tag tag-sub">{{ subtype(item).label }}</span>
                  <span class="card-tag tag-loc">{{ item.location }}</span>
                  <span class="card-tag tag-dur">{{ item.duration }}</span>
                </span>
                <span v-if="item.efficacyTags && item.efficacyTags.length" class="card-eff">
                  {{ item.efficacyTags.slice(0, 3).join(' · ') }}
                </span>
                <span v-if="item.price" class="card-price">¥{{ item.price }}</span>
              </span>
              <span class="active-emblem" aria-hidden="true">
                <span class="emblem-ring"></span>
                <ZenIcon :size="20" class="emblem-icon" />
              </span>
            </button>
          </div>
          <div v-else class="tray-empty">此器物暂无收录的养生项目</div>
        </div>

        <!-- 右栏：卡片详情 -->
        <div class="right-pane">
          <div v-if="activeItem" class="unfold-sheet">
            <div class="sheet-roller roller-t"></div>

            <div class="sheet-body">
              <div class="sheet-top">
                <div class="sheet-image-frame">
                  <img loading="lazy" :src="activeItem.image" :alt="activeItem.name" class="sheet-image" />
                  <span class="sheet-subtype-tag">
                    <component :is="subtype(activeItem).icon" :size="14" class="sheet-sub-icon" />
                    {{ subtype(activeItem).label }}
                  </span>
                  <span v-if="activeItem.heritageLevel" class="sheet-seal">
                    {{ heritageLabel[activeItem.heritageLevel] || '非遗' }}
                  </span>
                </div>

                <div class="sheet-info">
                  <div class="sheet-title-row">
                    <h4 class="sheet-title">{{ activeItem.name }}</h4>
                    <div class="sheet-actions">
                      <button
                        class="action-btn btn-fav"
                        :class="{ 'is-active': isExperienceFavorite(activeItem.id, provinceId, 'wellness') }"
                        title="收藏"
                        @click="onToggleFavorite(activeItem)"
                      >
                        <HeartIcon :size="17" :filled="isExperienceFavorite(activeItem.id, provinceId, 'wellness')" />
                        <span>{{ isExperienceFavorite(activeItem.id, provinceId, 'wellness') ? '已收藏' : '收藏' }}</span>
                      </button>
                      <button

                        class="action-btn btn-been"
                        :class="{ 'is-active': isExperienceBeen(activeItem.id, provinceId, 'wellness') }"
                        :title="isExperienceBeen(activeItem.id, provinceId, 'wellness') ? '已体验' : '体验'"
                        @click="onToggleBeen(activeItem)"
                      >
                        <FlagIcon :size="17" :filled="isExperienceBeen(activeItem.id, provinceId, 'wellness')" />
                        <span>{{ isExperienceBeen(activeItem.id, provinceId, 'wellness') ? '已体验' : '体验' }}</span>
                      </button>
                      <button
                        class="action-btn btn-share"
                        title="分享"
                        @click="shareExperience(activeItem)"
                      >
                        <ShareIcon :size="17" />
                        <span>分享</span>
                      </button>
                    </div>
                  </div>

                  <div v-if="activeItem.rating" class="sheet-rating">
                    <StarIcon :size="16" class="rating-star" />
                    <span class="rating-num">{{ activeItem.rating }}</span>
                    <span v-if="activeItem.reviewCount" class="rating-count">({{ activeItem.reviewCount }})</span>
                  </div>

                  <p class="sheet-desc">{{ activeItem.description }}</p>

                  <div v-if="activeItem.efficacyTags && activeItem.efficacyTags.length" class="sheet-efficacy">
                    <span
                      v-for="(t, ti) in activeItem.efficacyTags"
                      :key="ti"
                      class="efficacy-chip"
                    >{{ t }}</span>
                  </div>

                  <div class="sheet-meta-grid">
                    <div class="meta-cell">
                      <span class="cell-key">地点</span>
                      <span class="cell-val">{{ activeItem.location || '—' }}</span>
                    </div>
                    <div class="meta-cell">
                      <span class="cell-key">时长</span>
                      <span class="cell-val">{{ activeItem.duration || '—' }}</span>
                    </div>
                    <div v-if="activeItem.price" class="meta-cell">
                      <span class="cell-key">价格</span>
                      <span class="cell-val price-val">¥{{ activeItem.price }}</span>
                    </div>
                    <div v-if="activeItem.bestSeason" class="meta-cell">
                      <span class="cell-key">最佳时段</span>
                      <span class="cell-val">{{ activeItem.bestSeason }}</span>
                    </div>
                    <div v-if="activeItem.difficulty" class="meta-cell">
                      <span class="cell-key">强度</span>
                      <span class="cell-val" :data-level="activeItem.difficulty">{{ activeItem.difficulty }}</span>
                    </div>
                    <div v-if="activeItem.reservation" class="meta-cell">
                      <span class="cell-key">预约</span>
                      <span class="cell-val">{{ activeItem.reservation }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sheet-bottom">
                <div v-if="activeItem.packageIncludes && activeItem.packageIncludes.length" class="sheet-block sheet-package">
                  <span class="block-label">套餐包含</span>
                  <ul class="package-list">
                    <li v-for="(p, pi) in activeItem.packageIncludes.slice(0, 5)" :key="pi">{{ p }}</li>
                  </ul>
                </div>

                <div v-if="activeItem.suitableFor && activeItem.suitableFor.length" class="sheet-block sheet-suitable">
                  <span class="block-label">适宜人群</span>
                  <div class="chip-row">
                    <span v-for="(s, si) in activeItem.suitableFor" :key="si" class="suitable-chip">{{ s }}</span>
                  </div>
                </div>

                <div v-if="activeItem.tags && activeItem.tags.length" class="sheet-tags">
                  <span
                    v-for="(tag, tagi) in activeItem.tags.slice(0, 4)"
                    :key="tagi"
                    class="tag-chip"
                    :class="{ 'tag-heritage': tag.includes('非遗') || tag.includes('传承') }"
                  >{{ tag }}</span>
                </div>
              </div>
            </div>

            <div class="sheet-roller roller-b"></div>
          </div>
          <div v-else class="detail-empty">
            <span class="empty-hint">择一项目 · 阅览卷笺</span>
          </div>
        </div>
      </div>

    </div>

    <!-- ============ 空态 ============ -->
    <div v-else class="empty-state">
      <div class="empty-tea-table">
        <div class="empty-table-top">
          <span class="empty-pedestal">
            <LeafIcon :size="32" />
          </span>
          <span class="empty-pedestal empty-pedestal--small"></span>
          <span class="empty-pedestal empty-pedestal--tall"></span>
        </div>
        <div class="empty-table-body">
          <h4 class="empty-title">茶案空空 · 典藏待备</h4>
          <p class="empty-desc">该地区的休闲养生项目正在收录整理中</p>
          <div class="empty-ink-seal">
            <span class="seal-ring"></span>
            <span class="seal-char">待</span>
          </div>
          <div class="empty-tags">
            <span class="zen-tag">温泉汤池</span>
            <span class="zen-tag">禅修静心</span>
            <span class="zen-tag">茶道品鉴</span>
            <span class="zen-tag">森林康养</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <TravelShareModal
    :visible="shareVisible"
    :title="shareTitle"
    :share-text="shareText"
    :share-url="shareUrl"
    @close="closeShare"
  />
</template>

<script setup lang="ts">
  import { ref, computed, markRaw, onMounted, watch } from 'vue';
  import type { Component } from 'vue';
  import DropletIcon from '../../../../icons/pages/scenery/DropletIcon.vue';
  import ZenIcon from '../../../../icons/pages/scenery/ZenIcon.vue';
  import TeacupIcon from '../../../../icons/pages/scenery/TeacupIcon.vue';
  import IncenseIcon from '../../../../icons/pages/scenery/IncenseIcon.vue';
  import LeafIcon from '../../../../icons/common/LeafIcon.vue';
  import TaijiIcon from '../../../../icons/pages/scenery/TaijiIcon.vue';
  import GourdIcon from '../../../../icons/pages/scenery/GourdIcon.vue';
  import StoneIcon from '../../../../icons/pages/scenery/StoneIcon.vue';
  import CoffeeIcon from '../../../../icons/pages/scenery/CoffeeIcon.vue';
  import StarIcon from '../../../../icons/common/StarIcon.vue';

  import HeartIcon from '../../../../icons/common/HeartIcon.vue';
  import FlagIcon from '../../../../icons/common/FlagIcon.vue';
  import ShareIcon from '../../../../icons/common/ShareIcon.vue';

  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelShare } from '../../../TravelShareModal/useTravelShare';
  import TravelShareModal from '../../../TravelShareModal/index.vue';

  const { show: showToast } = useTravelToast();
  const {
    isExperienceFavorite,
    isExperienceWant,
    isExperienceBeen,
    toggleExperienceFavorite,
    toggleExperienceWant,
    toggleExperienceBeen,
  } = useSceneryPrefs();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const shareExperience = (item: any): void => {
    if (!item?.name) return;
    openShare(item.name, `${item.name}｜${item.location || ''}｜休闲养生`);
    showToast({ type: 'share', message: `正在分享 ${item.name}` });
  };

  const onToggleFavorite = (item: any): void => {
    if (!item?.id) return;
    const wasFav = isExperienceFavorite(item.id, props.provinceId, 'wellness');
    toggleExperienceFavorite(item.id, props.provinceId, 'wellness');
    showToast({ type: 'info', message: wasFav ? `已取消收藏 ${item.name}` : `已收藏 ${item.name}` });
  };
  const onToggleWant = (item: any): void => {
    if (!item?.id) return;
    const wasWant = isExperienceWant(item.id, props.provinceId, 'wellness');
    toggleExperienceWant(item.id, props.provinceId, 'wellness');
    showToast({ type: 'want', message: wasWant ? `已移除想去 ${item.name}` : `已加入想去 ${item.name}` });
  };
  const onToggleBeen = (item: any): void => {
    if (!item?.id) return;
    const wasBeen = isExperienceBeen(item.id, props.provinceId, 'wellness');
    toggleExperienceBeen(item.id, props.provinceId, 'wellness');
    showToast({ type: 'success', message: wasBeen ? `已取消体验 ${item.name}` : `已体验 ${item.name}` });
  };

  const props = defineProps<{
    items: any[];
    provinceId: string;
  }>();

  interface Subtype {
    key: string;
    label: string;
    color: string;
    icon: Component;
    match: string[];
  }

  // 分类匹配顺序：具体分类优先，forest 自然慢游兜底放最后
  const SUBTYPES: Subtype[] = [
    { key: 'spring', label: '温泉汤池', color: '#4A8B8C', icon: markRaw(DropletIcon), match: ['温泉', '汤泉', '汤池', '泡汤'] },
    { key: 'zen', label: '禅修静心', color: '#6B4E3D', icon: markRaw(ZenIcon), match: ['禅', '静心', '抄经', '打坐', '闭关', '寺', '庙', '朝圣', '祈福', '转经', '冥想', '礼佛', '佛教', '梵音', '道场'] },
    { key: 'taiji', label: '瑜伽太极', color: '#A66548', icon: markRaw(TaijiIcon), match: ['瑜伽', '太极', '八段锦', '气功', '道教', '道修', '吐纳', '导引', '道长', '武术', '晨练'] },
    { key: 'tea', label: '茶道品鉴', color: '#B8843C', icon: markRaw(TeacupIcon), match: ['茶道', '茶艺', '茶席', '采茶', '制茶', '品茶', '品茗', '喝茶', '叹茶', '早茶', '茶馆', '茶摊', '茶社', '茶楼', '盖碗茶', '红茶', '绿茶', '龙井', '碧螺春', '岩茶', '茗茶', '药茶'] },
    { key: 'coffee', label: '咖啡茶歇', color: '#6F4E37', icon: markRaw(CoffeeIcon), match: ['咖啡', '下午茶', 'cafe'] },
    { key: 'incense', label: '香道花道', color: '#8C8278', icon: markRaw(IncenseIcon), match: ['香道', '花道', '插花', '闻香', '香席', '花会', '花海', '牡丹', '赏花', '油菜花'] },
    { key: 'gourd', label: '药膳食疗', color: '#C9A04A', icon: markRaw(GourdIcon), match: ['药膳', '食疗', '养生餐', '本草', '美食', '品果', '葡萄', '蛋挞', '小吃', '滋补', '药酒'] },
    { key: 'spa', label: 'SPA推拿', color: '#7A8B8B', icon: markRaw(StoneIcon), match: ['SPA', 'spa', '推拿', '按摩', '足道', '理疗', '精油', '水疗'] },
    { key: 'forest', label: '森林康养', color: '#5A7D5A', icon: markRaw(LeafIcon), match: ['森林', '康养', '氧吧', '森林浴', '漫步', '慢游', '慢生活', '古镇', '古城', '老城', '园林', '海岛', '渔村', '湖畔', '湿地', '水乡', '绿道', '骑行', '草原', '沙漠', '盐湖', '避暑', '山庄', '洋房', '苗寨', '村落', '泛舟', '长寿', '山林', '徒步', '夜游', '星空', '露营', '岩画', '探秘', '观鸟', '海滨', '广场', '街区', '大街', '城市', '文化', '书院', '高空'] },
  ];

  const selectedSub = ref<string | null>(null);
  const activeIndex = ref<number>(-1);

  const subtype = (item: any): Subtype => {
    const t = `${item.type || ''}${item.name || ''}`;
    for (const s of SUBTYPES) {
      if (s.match.some((m) => t.includes(m))) return s;
    }
    // 兜底归入森林康养（自然慢游），而非温泉汤池
    return SUBTYPES.find((s) => s.key === 'forest') || SUBTYPES[0];
  };

  const subCount = (key: string): number =>
    (props.items || []).filter((it) => subtype(it).key === key).length;

  const filteredItems = computed<any[]>(() =>
    (props.items || []).filter((it) => {
      const okSub = selectedSub.value === null || subtype(it).key === selectedSub.value;
      return okSub;
    }),
  );

  const activeItem = computed<any | null>(() => {
    if (activeIndex.value < 0 || activeIndex.value >= filteredItems.value.length) return null;
    return filteredItems.value[activeIndex.value];
  });

  const selectAll = () => {
    selectedSub.value = null;
    activeIndex.value = filteredItems.value.length > 0 ? 0 : -1;
  };

  const toggleSub = (key: string) => {
    selectedSub.value = selectedSub.value === key ? null : key;
    activeIndex.value = filteredItems.value.length > 0 ? 0 : -1;
  };

  const select = (index: number) => {
    activeIndex.value = index;
  };

  onMounted(() => {
    if (filteredItems.value.length > 0) {
      activeIndex.value = 0;
    }
  });

  watch(
    () => props.items,
    () => {
      if (filteredItems.value.length > 0 && (activeIndex.value < 0 || activeIndex.value >= filteredItems.value.length)) {
        activeIndex.value = 0;
      }
    },
  );

  const heritageShort: Record<string, string> = {
    national: '国家级',
    provincial: '省级',
    municipal: '市级',
  };

  const heritageLabel: Record<string, string> = {
    national: '国家级非遗',
    provincial: '省级非遗',
    municipal: '市级非遗',
  };
</script>

<style scoped src="./index.scss" lang="scss" />
