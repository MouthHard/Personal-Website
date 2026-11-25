<template>
  <div class="region-cascader" :class="{ 'is-open': open }">
    <button
      type="button"
      class="rc-trigger"
      :aria-label="placeholder"
      @click="toggle"
    >
      <span class="rc-value" :class="{ 'is-placeholder': !labelText }">
        {{ labelText || placeholder }}
      </span>
      <svg
        class="rc-arrow"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9 L12 15 L18 9" />
      </svg>
      <span
        v-if="clearable && innerValue.length"
        class="rc-clear"
        role="button"
        aria-label="清除"
        @click.stop="clear"
      >
        ×
      </span>
    </button>

    <Transition name="rc-panel">
      <div v-if="open" class="rc-panel">
        <div class="rc-col rc-col-province">
          <div
            v-for="opt in options"
            :key="opt.value"
            class="rc-item"
            :class="{ active: innerValue[0] === opt.value }"
            @click="selectProvince(opt)"
          >
            <span>{{ opt.label }}</span>
            <svg
              v-if="opt.children?.length"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M9 6 L15 12 L9 18" />
            </svg>
          </div>
        </div>
        <div v-if="activeChildren.length" class="rc-col rc-col-city">
          <div
            v-for="opt in activeChildren"
            :key="opt.value"
            class="rc-item"
            :class="{ active: innerValue[1] === opt.value }"
            @click="selectCity(opt)"
          >
            <span>{{ opt.label }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';

  interface Option {
    value: string;
    label: string;
    children?: Option[];
  }

  interface Props {
    modelValue?: string[];
    options: Option[];
    placeholder?: string;
    clearable?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    placeholder: '请选择',
    clearable: true,
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
    (e: 'change', value: string[]): void;
  }>();

  const open = ref(false);
  const innerValue = ref<string[]>([...props.modelValue]);

  watch(
    () => props.modelValue,
    (v) => {
      innerValue.value = [...(v || [])];
    },
  );

  const activeChildren = computed<Option[]>(() => {
    const province = props.options.find((o) => o.value === innerValue.value[0]);
    return province?.children || [];
  });

  const labelText = computed(() =>
    innerValue.value.filter(Boolean).join(' · '),
  );

  const emitValue = (value: string[]) => {
    innerValue.value = value;
    emit('update:modelValue', value);
    emit('change', value);
  };

  const selectProvince = (opt: Option) => {
    const city = activeChildren.value.some(
      (c) => c.value === innerValue.value[1],
    )
      ? innerValue.value[1]
      : '';
    emitValue(city ? [opt.value, city] : [opt.value]);
  };

  const selectCity = (opt: Option) => {
    const province = innerValue.value[0];
    emitValue([province, opt.value]);
    open.value = false;
  };

  const clear = () => emitValue([]);

  const toggle = () => {
    open.value = !open.value;
  };
</script>

<style scoped lang="scss">
  .region-cascader {
    position: relative;
    width: 100%;
  }

  .rc-trigger {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid rgba(82, 160, 255, 0.35);
    border-radius: 8px;
    background: rgba(10, 18, 30, 0.7);
    color: #fff;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.2s;

    &:hover {
      border-color: rgba(82, 160, 255, 0.7);
    }
  }

  .is-open .rc-trigger {
    border-color: rgba(82, 160, 255, 0.9);
  }

  .rc-value {
    flex: 1;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.is-placeholder {
      color: rgba(255, 255, 255, 0.45);
    }
  }

  .rc-arrow {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.6);
    transition: transform 0.2s;
  }

  .is-open .rc-arrow {
    transform: rotate(180deg);
  }

  .rc-clear {
    flex-shrink: 0;
    margin-left: 6px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 18px;
    line-height: 1;

    &:hover {
      color: #fff;
    }
  }

  .rc-panel {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 20;
    display: flex;
    width: 100%;
    max-width: 420px;
    min-height: 180px;
    border: 1px solid rgba(82, 160, 255, 0.35);
    border-radius: 8px;
    background: rgba(14, 22, 36, 0.98);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  .rc-col {
    flex: 1;
    max-height: 220px;
    overflow-y: auto;
    padding: 6px 0;

    & + .rc-col {
      border-left: 1px solid rgba(255, 255, 255, 0.08);
    }
  }

  .rc-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;

    &:hover {
      background: rgba(82, 160, 255, 0.14);
      color: #fff;
    }

    &.active {
      background: rgba(82, 160, 255, 0.24);
      color: #7cc4ff;
    }
  }

  .rc-panel-enter-active,
  .rc-panel-leave-active {
    transition:
      opacity 0.18s,
      transform 0.18s;
  }

  .rc-panel-enter-from,
  .rc-panel-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
</style>
