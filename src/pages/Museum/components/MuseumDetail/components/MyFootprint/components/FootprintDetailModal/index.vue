<template>
  <Teleport to="body">
    <transition name="fp-modal-fade">
      <div v-if="visible" class="fp-detail-modal" @click.self="handleClose">
        <!-- 顶部射灯 -->
        <span class="modal-spotlight" aria-hidden="true"></span>

        <div class="fp-modal-panel">
          <!-- 玻璃反光层 -->
          <span class="panel-glass-reflect" aria-hidden="true"></span>

          <!-- 顶部装饰条 + 标题铭牌 -->
          <div class="fp-modal-header">
            <span class="header-line left"></span>
            <div class="header-plaque">
              <span class="plaque-glow"></span>
              <span class="plaque-type">{{ typeName }}</span>
              <span class="plaque-divider"></span>
              <span class="plaque-title">{{ title }}</span>
            </div>
            <span class="header-line right"></span>
            <button class="fp-close-btn" type="button" aria-label="关闭" @click="handleClose">
              <span class="close-gloss"></span>
              <CloseIcon />
            </button>
          </div>

          <div class="fp-modal-body">
            <!-- 主图区：展柜画框风格 -->
            <div class="fp-gallery">
              <span class="gallery-corner tl"></span>
              <span class="gallery-corner tr"></span>
              <span class="gallery-corner bl"></span>
              <span class="gallery-corner br"></span>
              <span class="gallery-lamp" aria-hidden="true">
                <span class="glamp-head"></span>
                <span class="glamp-cone"></span>
              </span>
              <div class="fp-gallery-stage">
                <img
                  v-if="image && !imageFailed"
                  :src="image"
                  :alt="title"
                  @error="imageFailed = true"
                />
                <div v-else class="fp-gallery-placeholder">
                  <component :is="typeIcon" />
                  <span>{{ title }}</span>
                </div>
                <div class="fp-gallery-glow" aria-hidden="true"></div>
                <div class="fp-gallery-scan" aria-hidden="true"></div>
              </div>
            </div>

            <!-- 信息区 -->
            <div class="fp-info">
              <div class="fp-info-museum">
                <span class="museum-icon"><MuseumBuildingIcon /></span>
                <span class="museum-name">{{ museumName }}</span>
                <span class="status-chip" :class="statusClass">
                  <span class="chip-dot"></span>
                  {{ status }}
                </span>
              </div>

              <div v-if="metaRows && metaRows.length" class="fp-meta-grid">
                <div v-for="row in metaRows" :key="row.label" class="fp-meta-item">
                  <span class="meta-label">{{ row.label }}</span>
                  <span class="meta-value">{{ row.value }}</span>
                </div>
              </div>

              <div v-if="description" class="fp-desc-section">
                <h4 class="fp-section-title">
                  <span class="title-bar"></span>
                  简介
                </h4>
                <p class="fp-desc-text">{{ description }}</p>
              </div>

              <div v-if="highlights && highlights.length" class="fp-highlights-section">
                <h4 class="fp-section-title">
                  <span class="title-bar"></span>
                  亮点
                </h4>
                <ul class="fp-highlights-list">
                  <li v-for="(h, i) in highlights" :key="i">
                    <span class="hl-dot"></span>
                    <span>{{ h }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="tags && tags.length" class="fp-tags-section">
                <span
                  v-for="(tag, i) in tags"
                  :key="tag"
                  class="fp-tag"
                  :class="`tag-color-${(i % 6) + 1}`"
                >{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- 底部交互区 -->
          <div class="fp-modal-footer">
            <div class="fp-modal-actions">
              <button
                v-for="action in actions"
                :key="action.key"
                class="fp-action-btn"
                :class="[`act-${action.key}`, { active: action.active }]"
                :title="action.label"
                @click="action.handler"
              >
                <span class="fp-action-gloss"></span>
                <component :is="action.icon" />
              </button>
            </div>
            <span class="fp-modal-hint">点击遮罩或关闭按钮可关闭弹窗</span>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed, type Component } from 'vue';
  import { CloseIcon, MuseumBuildingIcon, VaseIcon, ImageIcon, PaletteIcon, LeafIcon } from '@/pages/Museum/icons/common';

  interface MetaRow {
    label: string;
    value: string;
  }

  interface ModalAction {
    key: string;
    label: string;
    icon: Component;
    active: boolean;
    handler: () => void;
  }

  interface Props {
    visible: boolean;
    type: 'artifact' | 'exhibition' | 'creative' | 'activity';
    typeName: string;
    title: string;
    image: string;
    museumName: string;
    status: string;
    description?: string;
    highlights?: string[];
    tags?: string[];
    metaRows?: MetaRow[];
    actions?: ModalAction[];
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{ (e: 'close'): void }>();

  const imageFailed = ref(false);

  const typeIcon = computed<Component>(() => {
    const map: Record<string, Component> = {
      artifact: VaseIcon,
      exhibition: ImageIcon,
      creative: PaletteIcon,
      activity: LeafIcon,
    };
    return map[props.type] || VaseIcon;
  });

  const statusClass = computed(() => {
    const s = props.status;
    if (s === '收藏') return 'favor';
    if (s === '点赞') return 'like';
    if (s === '关注') return 'follow';
    return 'default';
  });

  const handleClose = () => emit('close');
</script>

<style lang="scss" scoped src="./index.scss"></style>
