<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="modalRoot"
      class="vf-modal"
      role="dialog"
      aria-modal="true"
      aria-label="图片详情"
      tabindex="-1"
      @click="emit('close')"
    >
      <!-- 深蓝皮面封皮装饰边 -->
      <div class="passport-cover" @click.stop>
        <!-- 烫金头部（国徽+标题+编号 横排） -->
        <div class="cover-header">
          <div class="cover-emblem">
            <CoverEmblemIcon />
          </div>
          <div class="cover-title-en">PASSPORT</div>
          <div class="cover-title-zh">护&#12288;照</div>
        </div>

        <!-- 关闭按钮（烫金圆章） -->
        <button aria-label="关闭" class="pp-close" @click="emit('close')">
          <span class="pp-close-x"></span>
        </button>

        <!-- ========== 摊开的护照两页 ========== -->
        <div class="passport-spread">
          <!-- 中间书脊装订区 -->
          <div class="spine"></div>

          <!-- ===== 左页：签证页 ===== -->
          <div class="page page-left">
            <div class="page-header">
              <span class="ph-en">VISA</span>
              <span class="ph-zh">签 证 页 — 0 3 —</span>
            </div>

            <!-- 签证贴照（风景照） -->
            <div class="visa-photo">
              <div class="vp-frame">
                <LandscapeImage
                  class="vp-img"
                  loading="lazy"
                  :src="image?.url"
                />
                <div class="vp-vignette"></div>
                <!-- 左上角金属图钉（装订点） -->
                <span class="vp-pin"></span>
                <!-- 底部手写 caption 条 -->
                <div class="vp-caption">
                  <span class="vc-loc">{{ image?.location || '远方' }}</span>
                  <span class="vc-sep">·</span>
                  <span class="vc-date">
                    {{ (image?.date || '2026·10·31').replace(/-/g, '·') }}
                  </span>
                </div>

                <!-- 紫色钢印 SVG 圆形章（缺墨/双印/粗糙化） -->
                <VisaStampIcon />
                <!-- 矩形入境章 -->
                <div class="entry-stamp">
                  <span class="es-port">PORT OF ENTRY</span>
                  <span class="es-loc">
                    {{
                      (image?.location || 'BEIJING').toUpperCase().slice(0, 12)
                    }}
                  </span>
                  <span class="es-date">
                    {{ (image?.date || '2026·10·31').replace(/-/g, '·') }}
                  </span>
                </div>
              </div>
              <!-- 签证页大号淡色水印 -->
              <div class="vp-watermark">VISA №03</div>
            </div>

            <!-- 签证有效期装饰条 -->
            <div class="visa-footer">
              <span class="vf-label">VALID UNTIL</span>
              <span class="vf-value">2027 · 10 · 31</span>
              <span class="vf-stamp">APPROVED ✓</span>
            </div>
          </div>

          <!-- ===== 右页：信息页 ===== -->
          <div class="page page-right">
            <div class="page-header">
              <span class="ph-en">PARTICULARS</span>
              <span class="ph-zh">信 息 页 — 0 4 —</span>
            </div>

            <!-- 信息字段（TITLE/AUTHOR 与左页备注区重复已移除） -->
            <div class="info-fields">
              <div class="if-row if-row-location">
                <span class="if-key">LOCATION</span>
                <LocationIcon class="if-loc-icon" />
                <span class="if-val">{{ image?.location || '远方' }}</span>
              </div>
              <div class="if-row if-row-remarks">
                <span class="if-key">REMARKS</span>
                <span class="if-val">{{ image?.title || '无题' }}</span>
              </div>
              <div class="if-row">
                <span class="if-key">CAMERA</span>
                <span class="if-val">{{ image?.camera || '---' }}</span>
              </div>
            </div>

            <!-- 签证类别（含标签） -->
            <div class="visa-type-tags">
              <span class="vtt-key">VISA TYPE</span>
              <div class="vtt-list">
                <span class="vtt-cat">{{ image?.category || 'TOURIST' }}</span>
                <span
                  v-for="(t, i) in (image?.tags || [])
                    .filter((t) => t !== image?.category)
                    .slice(0, 4)"
                  :key="t"
                  :class="['vtt-tag', `vtt-tag-${i % 4}`]"
                >
                  {{ t }}
                </span>
              </div>
            </div>

            <!-- 签发官/作者卡片（护照隐喻：签证官签章） -->
            <div v-if="photographer" class="author-card">
              <span class="ac-label">ISSUED BY · 签 发 官</span>
              <div class="ac-body">
                <div class="ac-avatar-wrap">
                  <LandscapeImage
                    class="ac-avatar"
                    loading="lazy"
                    :src="photographer.avatar"
                    :alt="photographer.name"
                    variant="avatar"
                  />
                  <span
                    v-if="photographer.verified"
                    class="ac-verified"
                    title="认证摄影师"
                  >
                    ✓
                  </span>
                </div>
                <div class="ac-info">
                  <span class="ac-name">{{ photographer.name }}</span>

                  <span class="ac-stats">
                    粉丝 {{ photographer.followers }} · 作品
                    {{ photographer.worksCount }}
                  </span>
                </div>
                <button
                  class="ac-follow"
                  :class="{ following: isAuthorFollowing }"
                  @click="toggleAuthorFollow"
                >
                  <span class="af-icon">
                    {{ isAuthorFollowing ? '✓' : '＋' }}
                  </span>
                  <span class="af-text">
                    {{ isAuthorFollowing ? '已关注' : '关注' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- 签发验证区 -->
            <div class="issue-verify">
              <div class="iv-info">
                <span class="iv-label">ISSUED · 签 发</span>
                <span class="iv-date">
                  {{ (image?.date || '2026-03-08').replace(/-/g, '·') }}
                </span>
                <span class="iv-org">EXIT-ENTRY ADMIN</span>
              </div>
              <div class="iv-seal">
                <IvSealIcon />
              </div>
            </div>

            <!-- 关联推荐（护照签证页风格） -->
            <div v-if="recommendItems.length > 0" class="passport-related">
              <div class="pr-header">
                <span class="pr-label">MORE · 更多探索</span>
                <span class="pr-count">{{ recommendItems.length }}</span>
              </div>
              <div class="pr-track">
                <div
                  v-for="item in recommendItems"
                  :key="`pr-${item.type}-${item.id}`"
                  class="pr-card"
                  :class="`pr-${item.type}`"
                  role="button"
                  tabindex="0"
                  :aria-label="`查看${item.title}`"
                  @click="handleRecommendSelect(item)"
                  @keydown.enter.prevent="handleRecommendSelect(item)"
                  @keydown.space.prevent="handleRecommendSelect(item)"
                >
                  <div class="pr-photo">
                    <LandscapeImage
                      :src="item.cover"
                      class="pr-img"
                      loading="lazy"
                      :alt="item.title"
                    />
                    <span class="pr-stamp">
                      {{ item.type === 'video' ? '视频' : '攻略' }}
                    </span>
                    <div class="pr-info">
                      <span class="pr-title">{{ item.title }}</span>
                      <span class="pr-loc">
                        {{ item.location || item.author }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 验讫章互动数据（两行：上行只读/即时操作，下行可切换 active） -->
            <div class="stamp-grid">
              <!-- 上行：浏览 / 分享 / 下载（无 active 状态） -->
              <div class="sg-cells sg-cells-top">
                <div class="sg-cell sg-views">
                  <EyeIcon class="sc-icon" />
                  <span class="sc-num">{{ formatNumber(counts.views) }}</span>
                  <span class="sc-text">浏览</span>
                </div>
                <button class="sg-cell sg-share" @click="emit('share')">
                  <ShareIcon class="sc-icon" />
                  <span class="sc-num">{{ formatNumber(counts.shares) }}</span>
                  <span class="sc-text">分享</span>
                </button>
                <button class="sg-cell sg-download" @click="emit('download')">
                  <DownloadIcon class="sc-icon" />
                  <span class="sc-num">DL</span>
                  <span class="sc-text">下载</span>
                </button>
              </div>
              <!-- 下行：点赞 / 喜爱 / 收藏（有 active 状态） -->
              <div class="sg-cells sg-cells-bottom">
                <button
                  class="sg-cell sg-like"
                  :class="{ active: liked }"
                  @click="emit('like')"
                >
                  <ThumbUpIcon class="sc-icon" :filled="liked" />
                  <span class="sc-num">{{ formatNumber(counts.likes) }}</span>
                  <span class="sc-text">点赞</span>
                </button>
                <button
                  class="sg-cell sg-love"
                  :class="{ active: loved }"
                  @click="emit('love')"
                >
                  <HeartIcon class="sc-icon" :filled="loved" />
                  <span class="sc-num">{{ formatNumber(counts.loves) }}</span>
                  <span class="sc-text">喜爱</span>
                </button>
                <button
                  class="sg-cell sg-bookmark"
                  :class="{ active: favorited }"
                  @click="emit('favorite')"
                >
                  <BookmarkIcon class="sc-icon" :filled="favorited" />
                  <span class="sc-num">
                    {{ formatNumber(counts.favorites) }}
                  </span>
                  <span class="sc-text">收藏</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== 底部控制区（深蓝皮面桌垫） ========== -->
        <div class="pp-control">
          <!-- 翻页导航 -->
          <button
            class="pp-nav pp-prev"
            :disabled="currentIndex <= 0"
            @click="emit('navigate', -1)"
          >
            <ChevronLeftIcon :stroke-width="2.5" />
            <span class="pp-nav-text">PREV</span>
          </button>

          <!-- 页码计数器 -->
          <div class="pp-counter">
            <span class="pc-current">
              {{ String(currentIndex + 1).padStart(2, '0') }}
            </span>
            <span class="pc-sep">/</span>
            <span class="pc-total">{{ String(total).padStart(2, '0') }}</span>
          </div>

          <button
            class="pp-nav pp-next"
            :disabled="currentIndex >= total - 1"
            @click="emit('navigate', 1)"
          >
            <span class="pp-nav-text">NEXT</span>
            <ChevronRightIcon :stroke-width="2.5" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <ConfirmDialog
    v-model:visible="confirmVisible"
    title="跨频道跳转"
    :message="confirmMessage"
    confirm-text="前往"
    cancel-text="留在这里"
    @confirm="handleConfirmJump"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import IvSealIcon from '@/pages/Landscape/icons/components/home/VisualFeast/ViewfinderModal/IvSealIcon.vue';
  import VisaStampIcon from '@/pages/Landscape/icons/components/home/VisualFeast/ViewfinderModal/VisaStampIcon.vue';
  import CoverEmblemIcon from '@/pages/Landscape/icons/components/home/VisualFeast/ViewfinderModal/CoverEmblemIcon.vue';
  import { useRouter } from 'vue-router';
  import ConfirmDialog from '@/pages/Landscape/components/common/ConfirmDialog/index.vue';
  import { formatNumber } from '@/utils/landscape/format';
  import { showMessage } from '@/utils/landscape';
  import {
    useInteractionStore,
    useLandscapeDataStore,
  } from '@/stores/landscape';
  import type { GlobalImage } from '@/typesOfPages/landscape/data';

  import { useRelatedRecommend } from '@/composables/landscape/useRelatedRecommend';
  import { useModalA11y } from '@/composables/landscape/useModalA11y';
  import ThumbUpIcon from '@/pages/Landscape/icons/common/ThumbUpIcon.vue';
  import HeartIcon from '@/pages/Landscape/icons/common/HeartIcon.vue';
  import BookmarkIcon from '@/pages/Landscape/icons/common/BookmarkIcon.vue';
  import ShareIcon from '@/pages/Landscape/icons/common/ShareIcon.vue';
  import DownloadIcon from '@/pages/Landscape/icons/common/DownloadIcon.vue';
  import EyeIcon from '@/pages/Landscape/icons/common/EyeIcon.vue';
  import LocationIcon from '@/pages/Landscape/icons/common/LocationIcon.vue';
  import ChevronLeftIcon from '@/pages/Landscape/icons/common/ChevronLeftIcon.vue';
  import ChevronRightIcon from '@/pages/Landscape/icons/common/ChevronRightIcon.vue';

  interface InteractionCounts {
    views: number;
    likes: number;
    loves: number;
    favorites: number;
    shares: number;
  }

  const props = defineProps<{
    visible: boolean;
    image: GlobalImage | null;
    currentIndex: number;
    total: number;
    counts: InteractionCounts;
    liked: boolean;
    loved: boolean;
    favorited: boolean;
  }>();

  const emit = defineEmits<{
    close: [];
    navigate: [direction: number];
    like: [];
    love: [];
    favorite: [];
    share: [];
    download: [];
  }>();

  const interactionStore = useInteractionStore();
  const dataStore = useLandscapeDataStore();

  const modalRoot = ref<HTMLElement | null>(null);

  useModalA11y(() => props.visible, {
    container: modalRoot,
    onClose: () => emit('close'),
  });

  const photographer = computed(() => {
    const authorId = props.image?.authorId;
    if (!authorId) return null;
    return dataStore.getPhotographer(authorId) || null;
  });

  const isAuthorFollowing = computed(() => {
    const id = props.image?.authorId;
    if (!id) return false;
    return interactionStore.isFollowing(id);
  });

  const toggleAuthorFollow = () => {
    const p = photographer.value;
    if (!p) return;
    const isAdded = interactionStore.toggleFollowPhotographer(p.id);
    if (isAdded) {
      showMessage.follow.success(p.name);
    } else {
      showMessage.follow.cancel(p.name);
    }
  };

  const { items: recommendItems } = useRelatedRecommend(() => ({
    currentId: props.image?.id,
    currentType: 'image' as const,
    authorId: props.image?.authorId,
    location: props.image?.location,
    tags: props.image?.tags,
  }));

  const router = useRouter();

  const typeLabelMap: Record<string, string> = {
    image: '图片',
    video: '视频',
    guide: '攻略',
  };

  const confirmVisible = ref(false);
  const confirmMessage = ref('');
  const pendingItem = ref<{ id: string; type: string } | null>(null);

  const handleRecommendSelect = (item: { id: string; type: string }) => {
    const label = typeLabelMap[item.type] || '内容';
    confirmMessage.value = `即将跳转至「${label}」详情页，是否继续？`;
    pendingItem.value = item;
    confirmVisible.value = true;
  };

  const handleConfirmJump = () => {
    const item = pendingItem.value;
    if (!item) return;
    emit('close');
    if (item.type === 'guide') {
      router.push({ path: '/landscape/guides', query: { id: item.id } });
    } else {
      router.push({
        path: '/landscape/category',
        query: { id: item.id, type: item.type },
      });
    }
    pendingItem.value = null;
  };
</script>

<style scoped lang="scss" src="./index.scss" />
