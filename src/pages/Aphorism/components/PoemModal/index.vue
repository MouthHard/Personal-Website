<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        ref="modalRef"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        @click="handleOverlayClick"
      >
        <!-- 溢出装饰：墨香飘散 -->
        <div class="overflow-ink-drift">
          <div
            v-for="n in 5"
            :key="n"
            class="ink-drop"
            :class="`drop-${n}`"
          ></div>
        </div>

        <!-- 溢出装饰：金光散射 -->
        <div class="overflow-gold-glow">
          <div
            v-for="n in 4"
            :key="n"
            class="gold-ray"
            :class="`gr-${n}`"
          ></div>
        </div>

        <!-- 双书轴并排容器 -->
        <div class="scroll-pair" @click.stop>
          <!-- ===== 左轴：诗词轴 ===== -->
          <div class="scroll scroll-poem">
            <!-- 交互按钮（左轴顶部中间） -->
            <div class="scroll-actions">
              <button
                type="button"
                class="action-button nav-button prev-button"
                :disabled="!hasPrev"
                title="上一首（←）"
                @click="$emit('navigate', 'prev')"
              >
                <BackArrowIcon />
              </button>
              <button
                type="button"
                class="action-button nav-button next-button"
                :disabled="!hasNext"
                title="下一首（→）"
                @click="$emit('navigate', 'next')"
              >
                <NextArrowIcon />
              </button>
              <span class="actions-divider" aria-hidden="true"></span>
              <button
                type="button"
                class="action-button like-button"
                :class="{ active: isLiked }"
                :title="isLiked ? '取消点赞' : '点赞'"
                @click="toggleLike"
              >
                <LikeIcon />
              </button>
              <button
                type="button"
                class="action-button love-button"
                :class="{ active: isLoved }"
                :title="isLoved ? '取消喜爱' : '喜爱'"
                @click="toggleLove"
              >
                <LoveIcon />
              </button>
              <button
                type="button"
                class="action-button favorite-button"
                :class="{ active: isFavorite }"
                :title="isFavorite ? '取消收藏' : '收藏'"
                @click="toggleFavorite"
              >
                <FavoriteIcon />
              </button>
              <button
                type="button"
                class="action-button share-button"
                title="分享"
                @click="sharePoem"
              >
                <ShareIcon />
              </button>
            </div>

            <!-- 顶部轴杆 -->
            <div class="scroll-rod scroll-rod-top">
              <div class="jade-pendant jade-pendant-left">
                <div class="pendant-cap"></div>
              </div>
              <div class="jade-pendant jade-pendant-right">
                <div class="pendant-cap"></div>
              </div>
              <div class="rod-body"></div>
            </div>

            <!-- 展开的纸面 -->
            <div class="scroll-paper">
              <!-- 纸背透印：卡片配图极淡叠底，仅作质感不夺文字（失效 prop 修复） -->
              <div
                v-if="backgroundImage"
                class="paper-backdrop"
                :style="{ backgroundImage: `url('${backgroundImage}')` }"
                aria-hidden="true"
              ></div>
              <div class="paper-texture"></div>
              <div class="paper-stain"></div>
              <div class="paper-crease paper-crease-1"></div>
              <div class="paper-crease paper-crease-2"></div>
              <div class="paper-border-outer"></div>
              <div class="paper-border-inner"></div>
              <div class="paper-corner paper-corner-tl"></div>
              <div class="paper-corner paper-corner-tr"></div>
              <div class="paper-corner paper-corner-bl"></div>
              <div class="paper-corner paper-corner-br"></div>
              <div class="paper-sunlight"></div>

              <!-- 诗词内容（横排布局） -->
              <div class="poem-content">
                <!-- 标题一行 -->
                <div class="poem-title-row">
                  <span class="poem-title-text">{{ poem.title }}</span>
                </div>

                <!-- 朝代+作者+体裁一行 -->
                <div class="poem-meta-row">
                  <span class="poem-dynasty-text">{{ poem.dynasty }}</span>
                  <span class="poem-author-text">{{ poem.author }}</span>
                  <span v-if="poem.form" class="poem-form-text">
                    {{ poem.form }}
                  </span>
                </div>

                <!-- 标签一行 -->
                <div
                  v-if="poem.tags && poem.tags.length > 0"
                  class="poem-tags-row"
                >
                  <span
                    v-for="tag in poem.tags"
                    :key="tag"
                    class="poem-tag"
                    role="button"
                    tabindex="0"
                    :title="`搜索标签：${tag}`"
                    @click="handleTagClick(tag)"
                    @keydown.enter="handleTagClick(tag)"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <!-- 诗句横排，每句一行 -->
                <div class="poem-lines">
                  <p
                    v-for="(line, index) in poem.content"
                    :key="`line-${index}-${line}`"
                    class="poem-line"
                  >
                    {{ line }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 底部轴杆 -->
            <div class="scroll-rod scroll-rod-bottom">
              <div class="jade-pendant jade-pendant-left">
                <div class="pendant-cap"></div>
              </div>
              <div class="jade-pendant jade-pendant-right">
                <div class="pendant-cap"></div>
              </div>
              <div class="rod-body"></div>
            </div>
          </div>

          <!-- ===== 右轴：注释轴 ===== -->
          <div class="scroll scroll-annotation">
            <!-- 关闭按钮（右轴顶部中间） -->
            <button
              ref="closeButtonRef"
              type="button"
              class="scroll-close"
              title="关闭（Esc）"
              @click="handleClose"
            >
              <span class="close-icon">×</span>
            </button>

            <!-- 顶部轴杆 -->
            <div class="scroll-rod scroll-rod-top">
              <div class="jade-pendant jade-pendant-left">
                <div class="pendant-cap"></div>
              </div>
              <div class="jade-pendant jade-pendant-right">
                <div class="pendant-cap"></div>
              </div>
              <div class="rod-body"></div>
            </div>

            <!-- 展开的纸面 -->
            <div class="scroll-paper">
              <div class="paper-texture"></div>
              <div class="paper-stain"></div>
              <div class="paper-crease paper-crease-1"></div>
              <div class="paper-crease paper-crease-2"></div>
              <div class="paper-border-outer"></div>
              <div class="paper-border-inner"></div>
              <div class="paper-corner paper-corner-tl"></div>
              <div class="paper-corner paper-corner-tr"></div>
              <div class="paper-corner paper-corner-bl"></div>
              <div class="paper-corner paper-corner-br"></div>
              <div class="paper-sunlight"></div>

              <!-- Tab按钮区 -->
              <div class="annotation-tabs">
                <button
                  type="button"
                  class="tab-button"
                  :class="{ active: activeTab === 'annotation' }"
                  @click="activeTab = 'annotation'"
                >
                  <AnnotationIcon class="tab-icon" />
                  <span class="tab-label">注释</span>
                </button>
                <button
                  type="button"
                  class="tab-button"
                  :class="{ active: activeTab === 'background' }"
                  @click="activeTab = 'background'"
                >
                  <BackgroundIcon class="tab-icon" />
                  <span class="tab-label">背景</span>
                </button>
                <button
                  type="button"
                  class="tab-button"
                  :class="{ active: activeTab === 'appreciation' }"
                  @click="activeTab = 'appreciation'"
                >
                  <AppreciationIcon class="tab-icon" />
                  <span class="tab-label">赏析</span>
                </button>
                <button
                  type="button"
                  class="tab-button"
                  :class="{ active: activeTab === 'poet' }"
                  @click="activeTab = 'poet'"
                >
                  <PoetIcon class="tab-icon" />
                  <span class="tab-label">诗人</span>
                </button>
              </div>

              <!-- Tab内容区 -->
              <div class="annotation-content">
                <div
                  v-show="activeTab === 'annotation'"
                  class="tab-panel annotation-panel"
                >
                  <template v-if="poem.annotation && poem.annotation.length">
                    <div
                      v-for="(item, idx) in poem.annotation"
                      :key="`anno-${idx}-${item.term}`"
                      class="annotation-card"
                    >
                      <span class="annotation-corner corner-tl"></span>
                      <span class="annotation-corner corner-tr"></span>
                      <span class="annotation-corner corner-bl"></span>
                      <span class="annotation-corner corner-br"></span>
                      <span class="annotation-term">{{ item.term }}</span>
                      <span class="annotation-explanation">
                        {{ item.explanation }}
                      </span>
                    </div>
                  </template>
                  <div v-else class="panel-empty">
                    <span class="empty-seal">注</span>
                    <span class="empty-label">暂无注释</span>
                  </div>
                </div>
                <div
                  v-show="activeTab === 'background'"
                  class="tab-panel background-panel"
                >
                  <template
                    v-if="
                      poem.background &&
                      (poem.background.era || poem.background.creation)
                    "
                  >
                    <div
                      v-if="poem.background.era"
                      class="background-section background-era"
                    >
                      <span class="background-section-corner corner-tl"></span>
                      <span class="background-section-corner corner-tr"></span>
                      <span class="background-section-corner corner-bl"></span>
                      <span class="background-section-corner corner-br"></span>
                      <div class="background-section-header">
                        <span class="background-section-seal">代</span>
                        <span class="background-section-title">时代背景</span>
                      </div>
                      <p class="background-section-text">
                        {{ poem.background.era }}
                      </p>
                    </div>
                    <div
                      v-if="poem.background.creation"
                      class="background-section background-creation"
                    >
                      <span class="background-section-corner corner-tl"></span>
                      <span class="background-section-corner corner-tr"></span>
                      <span class="background-section-corner corner-bl"></span>
                      <span class="background-section-corner corner-br"></span>
                      <div class="background-section-header">
                        <span class="background-section-seal">创</span>
                        <span class="background-section-title">创作背景</span>
                      </div>
                      <p class="background-section-text">
                        {{ poem.background.creation }}
                      </p>
                    </div>
                  </template>
                  <div v-else class="panel-empty">
                    <span class="empty-seal">景</span>
                    <span class="empty-label">暂无创作背景</span>
                  </div>
                </div>
                <div
                  v-show="activeTab === 'appreciation'"
                  class="tab-panel appreciation-panel"
                >
                  <template v-if="poem.appreciation">
                    <div class="appreciation-card artistic-card">
                      <div class="card-header">
                        <span class="card-seal artistic-seal">
                          <ArtisticSealIcon class="seal-icon" />
                        </span>
                        <span class="card-title">艺术特色</span>
                      </div>
                      <div class="card-body">
                        <!-- eslint-disable-next-line vue/no-v-html —— 内容经 DOMPurify 白名单净化（见 appreciationHtml computed） -->
                        <p
                          class="card-text"
                          v-html="appreciationHtml.artistic"
                        ></p>
                      </div>
                    </div>
                    <div class="appreciation-card emotion-card">
                      <div class="card-header">
                        <span class="card-seal emotion-seal">
                          <EmotionSealIcon class="seal-icon" />
                        </span>
                        <span class="card-title">思想感情</span>
                      </div>
                      <div class="card-body">
                        <!-- eslint-disable-next-line vue/no-v-html —— 内容经 DOMPurify 白名单净化 -->
                        <p
                          class="card-text"
                          v-html="appreciationHtml.emotion"
                        ></p>
                      </div>
                    </div>
                    <div
                      v-if="poem.appreciation.highlightAnalysis?.length"
                      class="appreciation-card highlight-card"
                    >
                      <div class="card-header">
                        <span class="card-seal highlight-seal">
                          <HighlightSealIcon class="seal-icon" />
                        </span>
                        <span class="card-title">名句赏析</span>
                      </div>
                      <div class="card-body">
                        <div
                          v-for="(item, idx) in poem.appreciation
                            .highlightAnalysis"
                          :key="`hl-${idx}-${item.verse}`"
                          class="highlight-item"
                        >
                          <div class="highlight-verse-box">
                            <p class="highlight-verse">{{ item.verse }}</p>
                          </div>
                          <p class="highlight-analysis">{{ item.analysis }}</p>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="poem.appreciation.status"
                      class="appreciation-card status-card"
                    >
                      <div class="card-header">
                        <span class="card-seal status-seal">
                          <StatusSealIcon class="seal-icon" />
                        </span>
                        <span class="card-title">文学地位</span>
                      </div>
                      <div class="card-body">
                        <!-- eslint-disable-next-line vue/no-v-html —— 内容经 DOMPurify 白名单净化 -->
                        <p
                          class="card-text"
                          v-html="appreciationHtml.status"
                        ></p>
                      </div>
                    </div>
                  </template>
                  <div v-else class="panel-empty">
                    <span class="empty-seal">赏</span>
                    <span class="empty-label">暂无赏析</span>
                  </div>
                </div>
                <div v-show="activeTab === 'poet'" class="tab-panel poet-panel">
                  <template v-if="poetData">
                    <div class="poet-card">
                      <div class="poet-name-row">
                        <span class="poet-name">{{ poem.author }}</span>
                        <span class="poet-badge poet-badge-dynasty">
                          {{ poem.dynasty }}
                        </span>
                        <span
                          v-if="poetData.courtesyName"
                          class="poet-badge poet-badge-courtesy"
                        >
                          字 {{ poetData.courtesyName }}
                        </span>
                        <span
                          v-if="poetData.pseudonym"
                          class="poet-badge poet-badge-pseudonym"
                        >
                          号 {{ poetData.pseudonym }}
                        </span>
                      </div>
                      <div class="poet-tags-row">
                        <span
                          v-if="poetData.birthDeath"
                          class="poet-tag poet-tag-year"
                        >
                          {{ poetData.birthDeath }}
                        </span>
                        <span
                          v-if="poetData.hometown"
                          class="poet-tag poet-tag-home"
                        >
                          {{ poetData.hometown }}
                        </span>
                        <span
                          v-if="poetData.identity"
                          class="poet-tag poet-tag-identity"
                        >
                          {{ poetData.identity }}
                        </span>
                        <span
                          v-if="poetData.title"
                          class="poet-tag poet-tag-title"
                        >
                          {{ poetData.title }}
                        </span>
                      </div>
                    </div>
                    <div class="poet-biography">
                      <p class="poet-biography-text">
                        {{ poetData.biography }}
                      </p>
                    </div>
                  </template>
                  <div v-else class="panel-empty">
                    <span class="empty-seal">传</span>
                    <span class="empty-label">暂无诗人介绍</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部轴杆 -->
            <div class="scroll-rod scroll-rod-bottom">
              <div class="jade-pendant jade-pendant-left">
                <div class="pendant-cap"></div>
              </div>
              <div class="jade-pendant jade-pendant-right">
                <div class="pendant-cap"></div>
              </div>
              <div class="rod-body"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    watch,
    nextTick,
    onMounted,
    onBeforeUnmount,
  } from 'vue';
  import DOMPurify from 'dompurify';
  import type { Poem } from '@/typesOfPages/aphorism/poem';
  import { usePoemInteractions } from '@/composables/aphorism/usePoemInteractions';
  import LikeIcon from '../../icons/PoemModal/LikeIcon.vue';
  import LoveIcon from '../../icons/PoemModal/LoveIcon.vue';
  import FavoriteIcon from '../../icons/PoemModal/FavoriteIcon.vue';
  import ShareIcon from '../../icons/PoemModal/ShareIcon.vue';
  import BackArrowIcon from '../../icons/common/BackArrowIcon.vue';
  import NextArrowIcon from '../../icons/common/NextArrowIcon.vue';
  import AnnotationIcon from '../../icons/common/AnnotationIcon.vue';
  import BackgroundIcon from '../../icons/common/BackgroundIcon.vue';
  import AppreciationIcon from '../../icons/common/AppreciationIcon.vue';
  import PoetIcon from '../../icons/common/PoetIcon.vue';
  import ArtisticSealIcon from '../../icons/PoemModal/ArtisticSealIcon.vue';
  import EmotionSealIcon from '../../icons/PoemModal/EmotionSealIcon.vue';
  import HighlightSealIcon from '../../icons/PoemModal/HighlightSealIcon.vue';
  import StatusSealIcon from '../../icons/PoemModal/StatusSealIcon.vue';
  import './index.scss';

  const props = defineProps<{
    visible: boolean;
    poem: Poem;
    /** 卡片配图：在左轴纸面以极淡「纸背透印」方式呈现，不破坏古纸卷轴质感 */
    backgroundImage?: string;
    /** 当前诗词在浏览列表中是否还有上一首 / 下一首（父组件根据上下文计算） */
    hasPrev?: boolean;
    hasNext?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'tag-click', tag: string): void;
    (e: 'navigate', direction: 'prev' | 'next'): void;
  }>();

  const activeTab = ref<'annotation' | 'background' | 'appreciation' | 'poet'>(
    'annotation',
  );

  const {
    isLiked,
    isLoved,
    isFavorite,
    toggleLike,
    toggleLove,
    toggleFavorite,
    recordView,
    sharePoem,
  } = usePoemInteractions(() => props.poem);

  const poetData = computed(() => {
    if (!props.poem.poetIntroduction) return null;
    if (typeof props.poem.poetIntroduction === 'string') {
      return { biography: props.poem.poetIntroduction };
    }
    return props.poem.poetIntroduction;
  });

  const modalRef = ref<HTMLElement | null>(null);
  const closeButtonRef = ref<HTMLButtonElement | null>(null);
  let savedOverflow = '';
  let previouslyFocused: HTMLElement | null = null;
  let bodyOverflowLocked = false;

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        // 记录最近浏览：下沉到弹窗，主页面与书房页两处入口自动覆盖。
        // 与 poem.id watch 的调用是幂等的（去重后移到最前），重复无害。
        recordView();
        savedOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        bodyOverflowLocked = true;
        // 焦点管理：记住触发元素，打开后聚焦关闭按钮
        previouslyFocused = document.activeElement as HTMLElement | null;
        nextTick(() => closeButtonRef.value?.focus());
      } else {
        // 仅在本组件确实锁定过 body 时恢复，避免初始 visible=false 时误改其他浮层的滚动锁
        if (bodyOverflowLocked) {
          document.body.style.overflow = savedOverflow;
          bodyOverflowLocked = false;
        }
        // 关闭后归还焦点
        previouslyFocused?.focus?.();
        previouslyFocused = null;
      }
    },
    { immediate: true },
  );

  // 「上一首/下一首」切换诗词（visible 不变）时：重置到注释页 + 记录新诗词的浏览足迹。
  // 首次打开由上面的 visible watch（immediate）负责记录，此处不 immediate 避免重复。
  watch(
    () => props.poem.id,
    () => {
      if (!props.visible) return;
      activeTab.value = 'annotation';
      recordView();
    },
  );

  // ESC 关闭 + 弹窗内焦点循环（Focus Trap）
  const FOCUSABLE =
    'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const handleKeydown = (e: KeyboardEvent) => {
    if (!props.visible) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
      return;
    }
    if (e.key === 'Tab' && modalRef.value) {
      const focusables = Array.from(
        modalRef.value.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  onMounted(() => document.addEventListener('keydown', handleKeydown));

  onBeforeUnmount(() => {
    if (bodyOverflowLocked) {
      document.body.style.overflow = savedOverflow;
      bodyOverflowLocked = false;
    }
    document.removeEventListener('keydown', handleKeydown);
    previouslyFocused?.focus?.();
  });

  const handleClose = () => {
    emit('close');
  };

  // 点击竹简标签：转发给父组件做标签搜索，同时关闭弹窗，
  // 避免切到搜索结果后弹窗仍悬浮遮挡（两个父组件的 handleTagClick 都会切换视图）
  const handleTagClick = (tag: string) => {
    emit('tag-click', tag);
    emit('close');
  };

  const handleOverlayClick = () => {
    handleClose();
  };

  // 赏析文本：先转义文本元字符，再把 Markdown 加粗/换行转为受控标签，
  // 最后用 DOMPurify 白名单净化，杜绝 XSS（即便未来接入后端数据也安全）
  const ALLOWED_TAGS = ['strong', 'br'];
  const formatAppreciationText = (text: string): string => {
    if (!text) return '';
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    return DOMPurify.sanitize(escaped, {
      ALLOWED_TAGS,
      ALLOWED_ATTR: [],
    });
  };

  // 缓存净化结果：赏析文本是静态的，只在诗词切换时重新净化一次，
  // 不再随 activeTab / 点赞状态等每次重渲染重复跑 3 遍 DOMPurify
  const appreciationHtml = computed(() => {
    const a = props.poem.appreciation;
    return {
      artistic: formatAppreciationText(a?.artistic ?? ''),
      emotion: formatAppreciationText(a?.emotion ?? ''),
      status: formatAppreciationText(a?.status ?? ''),
    };
  });
</script>
