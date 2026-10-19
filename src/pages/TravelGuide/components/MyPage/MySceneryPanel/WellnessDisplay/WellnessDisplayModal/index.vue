<script setup lang="ts">
  import { computed } from 'vue';
  import type { ExperienceItem } from '@/typesOfPages/travelGuide';
  import CloseIcon from '@/pages/TravelGuide/icons/common/CloseIcon.vue';
  import HeartIcon from '@/pages/TravelGuide/icons/common/HeartIcon.vue';
  import FlagIcon from '@/pages/TravelGuide/icons/common/FlagIcon.vue';
  import ShareIcon from '@/pages/TravelGuide/icons/common/ShareIcon.vue';
  import LocationIcon from '@/pages/TravelGuide/icons/common/LocationIcon.vue';
  import StarIcon from '@/pages/TravelGuide/icons/common/StarIcon.vue';
  import ClockIcon from '@/pages/TravelGuide/icons/common/ClockIcon.vue';
  import SunIcon from '@/pages/TravelGuide/icons/common/SunIcon.vue';
  import LeafIcon from '@/pages/TravelGuide/icons/common/LeafIcon.vue';
  import UsersIcon from '@/pages/TravelGuide/icons/pages/scenery/UsersIcon.vue';
  import GourdIcon from '@/pages/TravelGuide/icons/pages/scenery/GourdIcon.vue';
  import { useSceneryPrefs } from '@/composables/travelGuide/useSceneryPrefs';
  import { useTravelToast } from '@/composables/travelGuide/useTravelToast';
  import { useTravelShare } from '@/pages/TravelGuide/components/TravelShareModal/useTravelShare';
  import TravelShareModal from '@/pages/TravelGuide/components/TravelShareModal/index.vue';

  const props = defineProps<{
    visible: boolean;
    item: ExperienceItem | null;
  }>();

  const emit = defineEmits<{
    close: [];
  }>();

  const { isExperienceFavorite, isExperienceBeen, toggleExperienceFavorite, toggleExperienceBeen } = useSceneryPrefs();
  const { show: showToast } = useTravelToast();
  const { shareVisible, shareTitle, shareText, shareUrl, openShare, closeShare } = useTravelShare();

  const pid = computed(() => (props.item as any)?.provinceId || '');
  const CAT = 'wellness';
  const isFav = computed(() => (props.item ? isExperienceFavorite(props.item.id, pid.value, CAT) : false));
  const isBeen = computed(() => (props.item ? isExperienceBeen(props.item.id, pid.value, CAT) : false));

  const onToggleFavorite = () => {
    if (!props.item) return;
    const was = isFav.value;
    toggleExperienceFavorite(props.item.id, pid.value, CAT);
    showToast({ type: 'info', message: was ? `已取消收藏 ${props.item.name}` : `已收藏 ${props.item.name}` });
  };
  const onToggleBeen = () => {
    if (!props.item) return;
    const was = isBeen.value;
    toggleExperienceBeen(props.item.id, pid.value, CAT);
    showToast({ type: 'success', message: was ? `已取消体验 ${props.item.name}` : `已体验 ${props.item.name}` });
  };
  const onShare = () => {
    if (!props.item) return;
    openShare(props.item.name, `${props.item.name}｜${props.item.location}｜休闲养生`);
    showToast({ type: 'share', message: `正在分享 ${props.item.name}` });
  };

  const heritageLabel: Record<string, string> = {
    national: '国家级非遗',
    provincial: '省级非遗',
    municipal: '市级非遗',
  };
</script>

<template>
  <Teleport to="body">
    <Transition name="cm-modal">
      <div v-if="visible && item" class="cm-mask" @click.self="emit('close')">
        <div class="cm-book" role="dialog" aria-modal="true">
          <span class="cm-stitch cm-stitch-tl" />
          <span class="cm-stitch cm-stitch-bl" />
          <span class="cm-stitch cm-stitch-br" />

          <span class="cm-corner cm-corner-tl" />
          <span class="cm-corner cm-corner-tr" />
          <span class="cm-corner cm-corner-bl" />
          <span class="cm-corner cm-corner-br" />

          <div class="cm-spine">
            <span class="spine-rib" />
            <span class="spine-title">锦 譜 圖 錄</span>
            <span class="spine-seal" />
          </div>

          <button class="cm-close" aria-label="关闭" @click="emit('close')">
            <CloseIcon width="28" height="28" />
          </button>

          <div class="cm-spread">
            <div class="cm-page cm-left">
              <div class="cm-photo">
                <img v-if="item.image" :src="item.image" class="cm-photo-img" alt="" />
                <span v-else class="cm-photo-empty">
                  <span class="empty-silk"></span>
                </span>
                <span class="cm-photo-glow"></span>
                <span class="cm-photo-frame"></span>
              </div>

              <div class="cm-name-block">
                <h2 class="cm-name">{{ item.name }}</h2>
                <span class="cm-type">{{ item.type }}</span>
              </div>

              <div class="cm-chips">
                <span v-if="item.rating" class="cm-chip chip-rate">
                  <StarIcon width="18" height="18" />
                  <span class="chip-val">{{ item.rating }}</span>
                  <span v-if="item.reviewCount" class="chip-sub">({{ item.reviewCount }})</span>
                </span>
                <span v-if="item.price" class="cm-chip chip-price">¥{{ item.price }}</span>
                <span v-if="item.heritageLevel" class="cm-chip chip-heritage">{{ heritageLabel[item.heritageLevel] || '非遗' }}</span>
              </div>

              <div class="cm-loc">
                <LocationIcon width="18" height="18" />
                <span>{{ item.location }}</span>
              </div>
            </div>

            <div class="cm-page cm-right">
              <div class="cm-desc-area">
                <p class="cm-desc">{{ item.description }}</p>
                <span class="desc-seal">養生</span>
              </div>

              <div v-if="item.efficacyTags && item.efficacyTags.length" class="cm-section cm-efficacy">
                <span class="section-title"><GourdIcon width="18" height="18" />锦性印鉴</span>
                <div class="eff-stamps">
                  <span v-for="(t, ti) in item.efficacyTags" :key="ti" class="eff-stamp">{{ t }}</span>
                </div>
              </div>

              <div class="cm-meta-grid">
                <div class="mg-cell">
                  <span class="mg-ring" />
                  <span class="mg-key"><ClockIcon width="16" height="16" />时长</span>
                  <span class="mg-val">{{ item.duration || '—' }}</span>
                </div>
                <div class="mg-cell">
                  <span class="mg-ring" />
                  <span class="mg-key"><LeafIcon width="16" height="16" />强度</span>
                  <span class="mg-val">{{ item.difficulty || '—' }}</span>
                </div>
                <div v-if="item.bestSeason" class="mg-cell">
                  <span class="mg-ring" />
                  <span class="mg-key"><SunIcon width="16" height="16" />时令</span>
                  <span class="mg-val">{{ item.bestSeason }}</span>
                </div>
                <div v-if="item.reservation" class="mg-cell">
                  <span class="mg-ring" />
                  <span class="mg-key"><GourdIcon width="16" height="16" />预约</span>
                  <span class="mg-val">{{ item.reservation }}</span>
                </div>
              </div>

              <div v-if="item.packageIncludes && item.packageIncludes.length" class="cm-section cm-package">
                <span class="section-title"><GourdIcon width="18" height="18" />锦谱组成</span>
                <div class="pkg-grid">
                  <div v-for="(p, pi) in item.packageIncludes" :key="pi" class="pkg-cell">
                    <span class="pkg-num">{{ pi + 1 }}</span>
                    <span class="pkg-text">{{ p }}</span>
                  </div>
                </div>
              </div>

              <div v-if="item.suitableFor && item.suitableFor.length" class="cm-section cm-suitable">
                <span class="section-title"><UsersIcon width="18" height="18" />宜赏之人</span>
                <div class="suit-row">
                  <span v-for="(s, si) in item.suitableFor" :key="si" class="suit-chip">
                    <span class="suit-seal">{{ si + 1 }}</span>
                    <span class="suit-text">{{ s }}</span>
                  </span>
                </div>
              </div>

              <div v-if="item.tags && item.tags.length" class="cm-tag-row">
                <span v-for="(tag, tagi) in item.tags" :key="tagi" class="cm-tag">{{ tag }}</span>
              </div>
            </div>
          </div>

          <div class="cm-actions">
            <button class="cm-action act-fav" :class="{ 'is-active': isFav }" @click="onToggleFavorite">
              <HeartIcon width="19" height="19" :filled="isFav" />
              <span>{{ isFav ? '已收藏' : '收藏' }}</span>
            </button>
            <button class="cm-action act-been" :class="{ 'is-active': isBeen }" @click="onToggleBeen">
              <FlagIcon width="19" height="19" :filled="isBeen" />
              <span>{{ isBeen ? '已体验' : '体验' }}</span>
            </button>
            <button class="cm-action act-share" @click="onShare">
              <ShareIcon width="19" height="19" />
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <TravelShareModal :visible="shareVisible" :title="shareTitle" :share-text="shareText" :share-url="shareUrl" @close="closeShare" />
  </Teleport>
</template>

<style scoped src="./index.scss" lang="scss"></style>
