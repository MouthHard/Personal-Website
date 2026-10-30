<template>
  <div class="star-system-state">
    <!-- ===== 分支一：数据加载中（星系场景） ===== -->
    <div v-if="!error" class="loader-shell">
      <div class="loader-scene">
        <div class="stardust">
          <span v-for="n in 14" :key="n"></span>
        </div>

        <div class="galaxy">
          <!-- 四层不规则轨道 · 五颗行星 -->
          <div class="orbit-wrap w-1">
            <div class="orbit o-1">
              <span class="planet pl-a"></span>
            </div>
          </div>
          <div class="orbit-wrap w-2">
            <div class="orbit o-2">
              <span class="planet pl-b"></span>
            </div>
          </div>
          <div class="orbit-wrap w-3">
            <div class="orbit o-3">
              <span class="planet pl-c"></span>
            </div>
          </div>
          <div class="orbit-wrap w-4">
            <div class="orbit o-4">
              <span class="planet pl-d"></span>
              <span class="planet pl-e"></span>
            </div>
          </div>

          <!-- 双恒星环绕系统 -->
          <div class="binary-system">
            <div class="binary-tilt">
              <div class="binary-orbit">
                <div class="star star-a">
                  <span class="star-glow"></span>
                  <span class="star-body"></span>
                  <span class="star-flare"></span>
                  <span class="star-spark"></span>
                </div>
                <div class="star star-b">
                  <span class="star-glow"></span>
                  <span class="star-body"></span>
                  <span class="star-flare"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="loading-text">正在唤醒星空</p>
      <div class="loading-bars">
        <span class="ld-bar"></span>
        <span class="ld-bar"></span>
        <span class="ld-bar"></span>
      </div>
      <span class="loading-hint">正在为你加载风景数据</span>
    </div>

    <!-- ===== 分支二：数据加载失败（熄灭的星核·求救信标，无卡片全场景） ===== -->
    <div v-else class="beacon-shell">
      <div class="void-dust">
        <span v-for="n in 10" :key="n"></span>
      </div>

      <div class="distress-scene">
        <div class="signal-plane">
          <span class="signal-wave sw1"></span>
          <span class="signal-wave sw2"></span>
          <span class="signal-wave sw3"></span>
        </div>

        <div class="debris-ring">
          <span class="debris d1"></span>
          <span class="debris d2"></span>
          <span class="debris d3"></span>
          <span class="debris d4"></span>
          <span class="debris d5"></span>
        </div>

        <div class="ember-core">
          <span class="core-halo"></span>
          <span class="core-body"></span>
          <span class="crack c1"></span>
          <span class="crack c2"></span>
          <span class="crack c3"></span>
          <span class="core-pulse"></span>
        </div>
      </div>

      <div class="signal-copy">
        <span class="signal-tag">SIGNAL LOST<span class="tag-cursor"></span></span>
        <h2 class="signal-title">星云暂时失联</h2>
        <p class="signal-msg">{{ error }}</p>
        <button class="relaunch-btn" @click="emit('retry')">
          <span class="relaunch-orb"></span>
          <span class="relaunch-label">重启信标</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'StarSystemState' });

defineProps<{
  /** 传入即视为加载失败，显示深空信标；为空显示加载星系 */
  error?: string | null;
}>();

const emit = defineEmits<{
  (e: 'retry'): void;
}>();
</script>

<style scoped lang="scss" src="./index.scss" />