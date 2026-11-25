<template>
  <Teleport to="body">
    <div v-if="visible" class="vf-modal" @click="emit('close')">
      <!-- 深蓝皮面封皮装饰边 -->
      <div class="passport-cover" @click.stop>
        <!-- 烫金头部（国徽+标题+编号 横排） -->
        <div class="cover-header">
          <div class="cover-emblem">
            <svg viewBox="0 0 60 60" class="emblem-svg">
              <!-- 外圈双线 -->
              <circle
                cx="30"
                cy="30"
                r="28"
                fill="none"
                stroke="#d4a84b"
                stroke-width="1.3"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="#d4a84b"
                stroke-width="0.5"
                opacity="0.7"
              />
              <!-- 左麦穗秆 -->
              <path
                d="M30 48 Q23 40 18 24"
                fill="none"
                stroke="#d4a84b"
                stroke-width="0.8"
                opacity="0.85"
              />
              <!-- 左麦粒 -->
              <g fill="#d4a84b" opacity="0.85">
                <ellipse
                  cx="25"
                  cy="42"
                  rx="1.1"
                  ry="2.2"
                  transform="rotate(-25 25 42)"
                />
                <ellipse
                  cx="22"
                  cy="36"
                  rx="1.1"
                  ry="2.2"
                  transform="rotate(-35 22 36)"
                />
                <ellipse
                  cx="19"
                  cy="30"
                  rx="1.1"
                  ry="2.2"
                  transform="rotate(-45 19 30)"
                />
                <ellipse
                  cx="18"
                  cy="25"
                  rx="1.1"
                  ry="2.2"
                  transform="rotate(-55 18 25)"
                />
              </g>
              <!-- 左麦芒 -->
              <g stroke="#d4a84b" stroke-width="0.4" opacity="0.5" fill="none">
                <path d="M25 42 L23 38" />
                <path d="M22 36 L20 32" />
                <path d="M19 30 L17 26" />
              </g>
              <!-- 右麦穗秆 -->
              <path
                d="M30 48 Q37 40 42 24"
                fill="none"
                stroke="#d4a84b"
                stroke-width="0.8"
                opacity="0.85"
              />
              <!-- 右麦粒 -->
              <g fill="#d4a84b" opacity="0.85">
                <ellipse
                  cx="35"
                  cy="42"
                  rx="1.1"
                  ry="2.2"
                  transform="rotate(25 35 42)"
                />
                <ellipse
                  cx="38"
                  cy="36"
                  rx="1.1"
                  ry="2.2"
                  transform="rotate(35 38 36)"
                />
                <ellipse
                  cx="41"
                  cy="30"
                  rx="1.1"
                  ry="2.2"
                  transform="rotate(45 41 30)"
                />
                <ellipse
                  cx="42"
                  cy="25"
                  rx="1.1"
                  ry="2.2"
                  transform="rotate(55 42 25)"
                />
              </g>
              <!-- 右麦芒 -->
              <g stroke="#d4a84b" stroke-width="0.4" opacity="0.5" fill="none">
                <path d="M35 42 L37 38" />
                <path d="M38 36 L40 32" />
                <path d="M41 30 L43 26" />
              </g>
              <!-- 中心五角星 -->
              <path
                d="M30 14 L32.2 21 L39.5 21 L33.6 25.5 L35.8 32.5 L30 28 L24.2 32.5 L26.4 25.5 L20.5 21 L27.8 21 Z"
                fill="#d4a84b"
                opacity="0.95"
              />
              <!-- 底部绶带 -->
              <path
                d="M16 47 Q30 53 44 47 L44 49 Q30 55 16 49 Z"
                fill="#d4a84b"
                opacity="0.25"
              />
              <path
                d="M16 47 Q30 53 44 47"
                fill="none"
                stroke="#d4a84b"
                stroke-width="0.8"
                opacity="0.7"
              />
              <path
                d="M16 49 Q30 55 44 49"
                fill="none"
                stroke="#d4a84b"
                stroke-width="0.6"
                opacity="0.5"
              />
              <!-- 中心圆点 -->
              <circle cx="30" cy="30" r="1.8" fill="#d4a84b" opacity="0.6" />
            </svg>
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
                <svg viewBox="0 0 100 100" class="visa-stamp">
                  <defs>
                    <filter
                      id="StampRough"
                      x="-6%"
                      y="-6%"
                      width="112%"
                      height="112%"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.9"
                        numOctaves="2"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="2"
                      />
                    </filter>
                  </defs>
                  <g filter="url(#StampRough)">
                    <!-- 外圈主印（缺墨断续） -->
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#9b5fc8"
                      stroke-width="2"
                      opacity="0.88"
                      stroke-dasharray="62 7 42 6 50 9 36 5"
                    />
                    <!-- 外圈副印（偏移双印） -->
                    <circle
                      cx="51.5"
                      cy="49"
                      r="46"
                      fill="none"
                      stroke="#9b5fc8"
                      stroke-width="1.4"
                      opacity="0.38"
                      stroke-dasharray="50 12 45 8 40 6"
                    />
                    <!-- 内圈 -->
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#9b5fc8"
                      stroke-width="1"
                      opacity="0.72"
                      stroke-dasharray="72 6 50 8 40 5"
                    />
                    <!-- 顶部弧线 -->
                    <path
                      d="M50 14 A36 36 0 0 1 86 50"
                      fill="none"
                      stroke="#9b5fc8"
                      stroke-width="0.8"
                      opacity="0.62"
                      stroke-dasharray="22 4 16 3"
                    />
                    <!-- 中心星 -->
                    <path
                      d="M50 30 L52 34 L56 32 L53 36 L57 38 L52 37 L50 41 L48 37 L43 38 L47 36 L44 32 L48 34 Z"
                      fill="#9b5fc8"
                      opacity="0.8"
                    />
                    <!-- 文字主印 -->
                    <text
                      x="50"
                      y="40"
                      text-anchor="middle"
                      font-size="11"
                      font-weight="700"
                      fill="#9b5fc8"
                      opacity="0.92"
                      letter-spacing="1"
                    >
                      VISA
                    </text>
                    <text
                      x="50"
                      y="54"
                      text-anchor="middle"
                      font-size="9"
                      font-weight="700"
                      fill="#9b5fc8"
                      opacity="0.88"
                      letter-spacing="0.5"
                    >
                      CHINA
                    </text>
                    <text
                      x="50"
                      y="68"
                      text-anchor="middle"
                      font-size="8"
                      fill="#9b5fc8"
                      opacity="0.78"
                    >
                      2026
                    </text>
                    <!-- 文字副印（偏移） -->
                    <text
                      x="51.5"
                      y="41"
                      text-anchor="middle"
                      font-size="11"
                      font-weight="700"
                      fill="#9b5fc8"
                      opacity="0.32"
                      letter-spacing="1"
                    >
                      VISA
                    </text>
                    <text
                      x="51.5"
                      y="55"
                      text-anchor="middle"
                      font-size="9"
                      font-weight="700"
                      fill="#9b5fc8"
                      opacity="0.28"
                      letter-spacing="0.5"
                    >
                      CHINA
                    </text>
                  </g>
                </svg>
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
                <svg viewBox="0 0 60 60" class="iv-seal-svg">
                  <defs>
                    <filter
                      id="SealRough"
                      x="-6%"
                      y="-6%"
                      width="112%"
                      height="112%"
                    >
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.85"
                        numOctaves="2"
                        result="noise"
                      />
                      <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="1.2"
                      />
                    </filter>
                  </defs>
                  <g filter="url(#SealRough)">
                    <circle
                      cx="30"
                      cy="30"
                      r="26"
                      fill="none"
                      stroke="#a02828"
                      stroke-width="1.6"
                      opacity="0.45"
                      stroke-dasharray="58 6 40 5 36 4"
                    />
                    <circle
                      cx="30"
                      cy="30"
                      r="22"
                      fill="none"
                      stroke="#a02828"
                      stroke-width="0.8"
                      opacity="0.3"
                      stroke-dasharray="50 5 38 4"
                    />
                    <path
                      d="M30 15 L31.8 20 L36.5 19 L32.8 22.5 L34.8 27 L30 24.5 L25.2 27 L27.2 22.5 L23.5 19 L28.2 20 Z"
                      fill="#a02828"
                      opacity="0.4"
                    />
                    <text
                      x="30"
                      y="36"
                      text-anchor="middle"
                      font-size="7"
                      font-weight="700"
                      fill="#a02828"
                      opacity="0.5"
                      letter-spacing="0.8"
                    >
                      APPROVED
                    </text>
                    <text
                      x="30"
                      y="43"
                      text-anchor="middle"
                      font-size="6"
                      fill="#a02828"
                      opacity="0.38"
                      letter-spacing="0.5"
                    >
                      签 发
                    </text>
                  </g>
                </svg>
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
                  @click="handleRecommendSelect(item)"
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
