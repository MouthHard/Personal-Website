<script setup lang="ts">
  defineOptions({ name: 'StarfieldBackground' });
</script>

<template>
  <svg
    class="bg-effect starfield-bg"
    width="100%"
    height="100%"
    viewBox="0 0 1920 1080"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- 星云渐变 -->
      <radialGradient id="nebulaBlue" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.55" />
        <stop offset="30%" stop-color="#1e40af" stop-opacity="0.35" />
        <stop offset="60%" stop-color="#1e3a8a" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#0a1228" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="nebulaPurple" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#818cf8" stop-opacity="0.45" />
        <stop offset="35%" stop-color="#6366f1" stop-opacity="0.25" />
        <stop offset="70%" stop-color="#4338ca" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="nebulaCyan" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5" />
        <stop offset="30%" stop-color="#0ea5e9" stop-opacity="0.3" />
        <stop offset="65%" stop-color="#0369a1" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#082f49" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="nebulaMagenta" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#f472b6" stop-opacity="0.35" />
        <stop offset="40%" stop-color="#ec4899" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#831843" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="nebulaDeep" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.4" />
        <stop offset="50%" stop-color="#172554" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#0a1228" stop-opacity="0" />
      </radialGradient>

      <!-- 银河带渐变 -->
      <linearGradient id="milkyWay" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e40af" stop-opacity="0" />
        <stop offset="20%" stop-color="#3b82f6" stop-opacity="0.15" />
        <stop offset="40%" stop-color="#818cf8" stop-opacity="0.22" />
        <stop offset="50%" stop-color="#a78bfa" stop-opacity="0.28" />
        <stop offset="60%" stop-color="#818cf8" stop-opacity="0.22" />
        <stop offset="80%" stop-color="#3b82f6" stop-opacity="0.15" />
        <stop offset="100%" stop-color="#1e40af" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="milkyWayCore" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#fde68a" stop-opacity="0" />
        <stop offset="45%" stop-color="#fbbf24" stop-opacity="0.12" />
        <stop offset="50%" stop-color="#fef3c7" stop-opacity="0.2" />
        <stop offset="55%" stop-color="#fbbf24" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#fde68a" stop-opacity="0" />
      </linearGradient>

      <!-- 行星渐变 -->
      <radialGradient id="planetBody" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#7dd3fc" stop-opacity="1" />
        <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.95" />
        <stop offset="60%" stop-color="#0284c7" stop-opacity="0.9" />
        <stop offset="85%" stop-color="#075985" stop-opacity="0.85" />
        <stop offset="100%" stop-color="#0c4a6e" stop-opacity="0.8" />
      </radialGradient>
      <linearGradient id="planetRing" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#7dd3fc" stop-opacity="0" />
        <stop offset="15%" stop-color="#7dd3fc" stop-opacity="0.6" />
        <stop offset="50%" stop-color="#e0f2fe" stop-opacity="0.85" />
        <stop offset="85%" stop-color="#7dd3fc" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0" />
      </linearGradient>

      <!-- 流星拖尾渐变（头亮→尾淡） -->
      <linearGradient id="meteorTrail" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
        <stop offset="30%" stop-color="#e0f2fe" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="meteorTrail2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.95" />
        <stop offset="25%" stop-color="#bae6fd" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>

      <!-- 发光滤镜 -->
      <filter id="starGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="strongGlow" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="nebulaBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="40" />
      </filter>
      <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>

    <!-- ========== 第1层：远景星云 ========== -->
    <g class="nebula-layer">
      <!-- 大型蓝紫星云（左上） -->
      <ellipse cx="380" cy="280" rx="520" ry="360" fill="url(#nebulaBlue)" filter="url(#nebulaBlur)">
        <animate attributeName="opacity" values="0.85;1;0.85" dur="14s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="scale" values="1;1.06;1" dur="18s" repeatCount="indefinite" additive="sum" />
      </ellipse>
      <!-- 紫色星云（中上偏左） -->
      <ellipse cx="780" cy="200" rx="420" ry="300" fill="url(#nebulaPurple)" filter="url(#nebulaBlur)">
        <animate attributeName="opacity" values="0.7;0.95;0.7" dur="16s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="20s" repeatCount="indefinite" additive="sum" />
      </ellipse>
      <!-- 青色星云（右下） -->
      <ellipse cx="1450" cy="780" rx="480" ry="340" fill="url(#nebulaCyan)" filter="url(#nebulaBlur)">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="13s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="scale" values="1;1.07;1" dur="22s" repeatCount="indefinite" additive="sum" />
      </ellipse>
      <!-- 粉紫小星云（中右，点缀） -->
      <ellipse cx="1600" cy="380" rx="280" ry="200" fill="url(#nebulaMagenta)" filter="url(#nebulaBlur)">
        <animate attributeName="opacity" values="0.5;0.85;0.5" dur="15s" repeatCount="indefinite" />
      </ellipse>
      <!-- 深蓝星云（左下角） -->
      <ellipse cx="250" cy="850" rx="380" ry="280" fill="url(#nebulaDeep)" filter="url(#nebulaBlur)">
        <animate attributeName="opacity" values="0.75;1;0.75" dur="17s" repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="19s" repeatCount="indefinite" additive="sum" />
      </ellipse>
      <!-- 青蓝星云（中下） -->
      <ellipse cx="960" cy="900" rx="360" ry="240" fill="url(#nebulaCyan)" filter="url(#nebulaBlur)" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="12s" repeatCount="indefinite" />
      </ellipse>
    </g>

    <!-- ========== 第2层：银河带 ========== -->
    <g class="milky-way-layer" transform="rotate(-28 960 540)">
      <rect x="-200" y="380" width="2320" height="320" fill="url(#milkyWay)" filter="url(#softBlur)" opacity="0.9">
        <animate attributeName="opacity" values="0.75;1;0.75" dur="20s" repeatCount="indefinite" />
      </rect>
      <rect x="-200" y="500" width="2320" height="80" fill="url(#milkyWayCore)" filter="url(#softBlur)" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.85;0.5" dur="18s" repeatCount="indefinite" />
      </rect>
      <!-- 银河带内密集星点 -->
      <g class="milky-stars" filter="url(#starGlow)">
        <circle cx="120" cy="520" r="0.8" fill="#fff" opacity="0.7"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" /></circle>
        <circle cx="180" cy="560" r="1" fill="#e0f2fe" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" /></circle>
        <circle cx="240" cy="500" r="0.7" fill="#fff" opacity="0.6"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.2s" repeatCount="indefinite" /></circle>
        <circle cx="300" cy="540" r="1.2" fill="#fde68a" opacity="0.75"><animate attributeName="opacity" values="0.3;0.75;0.3" dur="3.5s" repeatCount="indefinite" /></circle>
        <circle cx="360" cy="490" r="0.9" fill="#fff" opacity="0.7"><animate attributeName="opacity" values="0.4;0.7;0.4" dur="2.8s" repeatCount="indefinite" /></circle>
        <circle cx="420" cy="570" r="0.8" fill="#e0f2fe" opacity="0.65"><animate attributeName="opacity" values="0.2;0.65;0.2" dur="2.6s" repeatCount="indefinite" /></circle>
        <circle cx="480" cy="510" r="1.1" fill="#fff" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.2s" repeatCount="indefinite" /></circle>
        <circle cx="540" cy="550" r="0.7" fill="#bae6fd" opacity="0.6"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.4s" repeatCount="indefinite" /></circle>
        <circle cx="600" cy="495" r="1.3" fill="#fff" opacity="0.85"><animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.8s" repeatCount="indefinite" /></circle>
        <circle cx="660" cy="565" r="0.9" fill="#e0f2fe" opacity="0.7"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.7s" repeatCount="indefinite" /></circle>
        <circle cx="720" cy="505" r="0.8" fill="#fff" opacity="0.65"><animate attributeName="opacity" values="0.2;0.65;0.2" dur="2.3s" repeatCount="indefinite" /></circle>
        <circle cx="780" cy="545" r="1" fill="#fde68a" opacity="0.75"><animate attributeName="opacity" values="0.4;0.75;0.4" dur="3.4s" repeatCount="indefinite" /></circle>
        <circle cx="840" cy="485" r="1.4" fill="#fff" opacity="0.9"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" /></circle>
        <circle cx="900" cy="555" r="0.8" fill="#e0f2fe" opacity="0.7"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" /></circle>
        <circle cx="960" cy="500" r="1.1" fill="#fff" opacity="0.85"><animate attributeName="opacity" values="0.4;0.85;0.4" dur="3.6s" repeatCount="indefinite" /></circle>
        <circle cx="1020" cy="560" r="0.9" fill="#bae6fd" opacity="0.7"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.8s" repeatCount="indefinite" /></circle>
        <circle cx="1080" cy="490" r="1.2" fill="#fff" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.3s" repeatCount="indefinite" /></circle>
        <circle cx="1140" cy="550" r="0.7" fill="#e0f2fe" opacity="0.6"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.2s" repeatCount="indefinite" /></circle>
        <circle cx="1200" cy="510" r="1" fill="#fff" opacity="0.75"><animate attributeName="opacity" values="0.3;0.75;0.3" dur="3.1s" repeatCount="indefinite" /></circle>
        <circle cx="1260" cy="565" r="0.8" fill="#fde68a" opacity="0.65"><animate attributeName="opacity" values="0.3;0.65;0.3" dur="2.6s" repeatCount="indefinite" /></circle>
        <circle cx="1320" cy="500" r="1.3" fill="#fff" opacity="0.85"><animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.7s" repeatCount="indefinite" /></circle>
        <circle cx="1380" cy="545" r="0.9" fill="#e0f2fe" opacity="0.7"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.7s" repeatCount="indefinite" /></circle>
        <circle cx="1440" cy="495" r="0.8" fill="#fff" opacity="0.65"><animate attributeName="opacity" values="0.2;0.65;0.2" dur="2.4s" repeatCount="indefinite" /></circle>
        <circle cx="1500" cy="560" r="1.1" fill="#bae6fd" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.5s" repeatCount="indefinite" /></circle>
        <circle cx="1560" cy="505" r="0.7" fill="#fff" opacity="0.6"><animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.3s" repeatCount="indefinite" /></circle>
        <circle cx="1620" cy="550" r="1" fill="#e0f2fe" opacity="0.75"><animate attributeName="opacity" values="0.4;0.75;0.4" dur="3.2s" repeatCount="indefinite" /></circle>
        <circle cx="1680" cy="490" r="0.9" fill="#fff" opacity="0.7"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" /></circle>
        <circle cx="1740" cy="565" r="1.2" fill="#fde68a" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.6s" repeatCount="indefinite" /></circle>
        <circle cx="1800" cy="510" r="0.8" fill="#fff" opacity="0.65"><animate attributeName="opacity" values="0.2;0.65;0.2" dur="2.2s" repeatCount="indefinite" /></circle>
      </g>
    </g>

    <!-- ========== 第3层：远景小星（密集，弱闪烁） ========== -->
    <g class="far-stars" filter="url(#starGlow)">
      <circle cx="60" cy="80" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" /></circle>
      <circle cx="130" cy="150" r="0.5" fill="#e0f2fe" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.8s" repeatCount="indefinite" /></circle>
      <circle cx="200" cy="90" r="0.7" fill="#fff" opacity="0.55"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.2s" repeatCount="indefinite" /></circle>
      <circle cx="270" cy="180" r="0.5" fill="#bae6fd" opacity="0.4"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.6s" repeatCount="indefinite" /></circle>
      <circle cx="340" cy="120" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.4s" repeatCount="indefinite" /></circle>
      <circle cx="410" cy="60" r="0.4" fill="#e0f2fe" opacity="0.35"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="1.5s" repeatCount="indefinite" /></circle>
      <circle cx="480" cy="160" r="0.7" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.1s" repeatCount="indefinite" /></circle>
      <circle cx="550" cy="100" r="0.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.9s" repeatCount="indefinite" /></circle>
      <circle cx="620" cy="190" r="0.6" fill="#bae6fd" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.3s" repeatCount="indefinite" /></circle>
      <circle cx="690" cy="130" r="0.4" fill="#fff" opacity="0.4"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.7s" repeatCount="indefinite" /></circle>
      <circle cx="760" cy="70" r="0.7" fill="#e0f2fe" opacity="0.55"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.5s" repeatCount="indefinite" /></circle>
      <circle cx="830" cy="170" r="0.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.8s" repeatCount="indefinite" /></circle>
      <circle cx="900" cy="110" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.2s" repeatCount="indefinite" /></circle>
      <circle cx="970" cy="200" r="0.4" fill="#bae6fd" opacity="0.35"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="1.6s" repeatCount="indefinite" /></circle>
      <circle cx="1040" cy="80" r="0.7" fill="#fff" opacity="0.55"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.4s" repeatCount="indefinite" /></circle>
      <circle cx="1110" cy="150" r="0.5" fill="#e0f2fe" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.9s" repeatCount="indefinite" /></circle>
      <circle cx="1180" cy="90" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.1s" repeatCount="indefinite" /></circle>
      <circle cx="1250" cy="180" r="0.4" fill="#fff" opacity="0.4"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.7s" repeatCount="indefinite" /></circle>
      <circle cx="1320" cy="120" r="0.7" fill="#bae6fd" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.3s" repeatCount="indefinite" /></circle>
      <circle cx="1390" cy="60" r="0.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.8s" repeatCount="indefinite" /></circle>
      <circle cx="1460" cy="160" r="0.6" fill="#e0f2fe" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.2s" repeatCount="indefinite" /></circle>
      <circle cx="1530" cy="100" r="0.4" fill="#fff" opacity="0.35"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="1.5s" repeatCount="indefinite" /></circle>
      <circle cx="1600" cy="190" r="0.7" fill="#fff" opacity="0.55"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.5s" repeatCount="indefinite" /></circle>
      <circle cx="1670" cy="130" r="0.5" fill="#bae6fd" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.9s" repeatCount="indefinite" /></circle>
      <circle cx="1740" cy="70" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.1s" repeatCount="indefinite" /></circle>
      <circle cx="1810" cy="170" r="0.4" fill="#e0f2fe" opacity="0.4"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.7s" repeatCount="indefinite" /></circle>
      <circle cx="1880" cy="110" r="0.7" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.3s" repeatCount="indefinite" /></circle>

      <!-- 下半部分远景星 -->
      <circle cx="90" cy="680" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" /></circle>
      <circle cx="160" cy="760" r="0.5" fill="#bae6fd" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.8s" repeatCount="indefinite" /></circle>
      <circle cx="230" cy="840" r="0.7" fill="#fff" opacity="0.55"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.2s" repeatCount="indefinite" /></circle>
      <circle cx="300" cy="720" r="0.4" fill="#e0f2fe" opacity="0.35"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="1.6s" repeatCount="indefinite" /></circle>
      <circle cx="370" cy="900" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.4s" repeatCount="indefinite" /></circle>
      <circle cx="440" cy="780" r="0.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.9s" repeatCount="indefinite" /></circle>
      <circle cx="510" cy="860" r="0.7" fill="#bae6fd" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.3s" repeatCount="indefinite" /></circle>
      <circle cx="580" cy="700" r="0.4" fill="#fff" opacity="0.4"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.7s" repeatCount="indefinite" /></circle>
      <circle cx="650" cy="820" r="0.6" fill="#e0f2fe" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.1s" repeatCount="indefinite" /></circle>
      <circle cx="720" cy="940" r="0.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.8s" repeatCount="indefinite" /></circle>
      <circle cx="790" cy="760" r="0.7" fill="#fff" opacity="0.55"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.5s" repeatCount="indefinite" /></circle>
      <circle cx="860" cy="880" r="0.4" fill="#bae6fd" opacity="0.35"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="1.6s" repeatCount="indefinite" /></circle>
      <circle cx="930" cy="720" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.2s" repeatCount="indefinite" /></circle>
      <circle cx="1000" cy="900" r="0.5" fill="#e0f2fe" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.9s" repeatCount="indefinite" /></circle>
      <circle cx="1070" cy="840" r="0.7" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.3s" repeatCount="indefinite" /></circle>
      <circle cx="1140" cy="780" r="0.4" fill="#fff" opacity="0.4"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.7s" repeatCount="indefinite" /></circle>
      <circle cx="1210" cy="920" r="0.6" fill="#bae6fd" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.1s" repeatCount="indefinite" /></circle>
      <circle cx="1280" cy="700" r="0.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.8s" repeatCount="indefinite" /></circle>
      <circle cx="1350" cy="860" r="0.7" fill="#e0f2fe" opacity="0.55"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.4s" repeatCount="indefinite" /></circle>
      <circle cx="1420" cy="740" r="0.4" fill="#fff" opacity="0.35"><animate attributeName="opacity" values="0.1;0.35;0.1" dur="1.5s" repeatCount="indefinite" /></circle>
      <circle cx="1490" cy="940" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.2s" repeatCount="indefinite" /></circle>
      <circle cx="1560" cy="820" r="0.5" fill="#bae6fd" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.9s" repeatCount="indefinite" /></circle>
      <circle cx="1630" cy="760" r="0.7" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.3s" repeatCount="indefinite" /></circle>
      <circle cx="1700" cy="900" r="0.4" fill="#e0f2fe" opacity="0.4"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.7s" repeatCount="indefinite" /></circle>
      <circle cx="1770" cy="780" r="0.6" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.1s" repeatCount="indefinite" /></circle>
      <circle cx="1840" cy="860" r="0.5" fill="#fff" opacity="0.45"><animate attributeName="opacity" values="0.15;0.45;0.15" dur="1.8s" repeatCount="indefinite" /></circle>
      <circle cx="1890" cy="940" r="0.7" fill="#bae6fd" opacity="0.55"><animate attributeName="opacity" values="0.25;0.55;0.25" dur="2.5s" repeatCount="indefinite" /></circle>
    </g>

    <!-- ========== 第4层：中景中星（中等闪烁） ========== -->
    <g class="mid-stars" filter="url(#starGlow)">
      <circle cx="110" cy="260" r="1.2" fill="#fff" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="280" cy="340" r="1.4" fill="#e0f2fe" opacity="0.85"><animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.5s" repeatCount="indefinite" /></circle>
      <circle cx="450" cy="280" r="1.1" fill="#fff" opacity="0.75"><animate attributeName="opacity" values="0.35;0.75;0.35" dur="2.8s" repeatCount="indefinite" /></circle>
      <circle cx="620" cy="360" r="1.3" fill="#bae6fd" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.2s" repeatCount="indefinite" /></circle>
      <circle cx="790" cy="300" r="1.5" fill="#fff" opacity="0.9"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="3.8s" repeatCount="indefinite" /></circle>
      <circle cx="960" cy="380" r="1.2" fill="#e0f2fe" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="1130" cy="260" r="1.4" fill="#fff" opacity="0.85"><animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.6s" repeatCount="indefinite" /></circle>
      <circle cx="1300" cy="340" r="1.1" fill="#bae6fd" opacity="0.75"><animate attributeName="opacity" values="0.35;0.75;0.35" dur="2.9s" repeatCount="indefinite" /></circle>
      <circle cx="1470" cy="280" r="1.3" fill="#fff" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.3s" repeatCount="indefinite" /></circle>
      <circle cx="1640" cy="360" r="1.5" fill="#e0f2fe" opacity="0.9"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="3.7s" repeatCount="indefinite" /></circle>
      <circle cx="1810" cy="300" r="1.2" fill="#fff" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.1s" repeatCount="indefinite" /></circle>

      <circle cx="180" cy="640" r="1.3" fill="#fff" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.2s" repeatCount="indefinite" /></circle>
      <circle cx="350" cy="720" r="1.1" fill="#bae6fd" opacity="0.75"><animate attributeName="opacity" values="0.35;0.75;0.35" dur="2.8s" repeatCount="indefinite" /></circle>
      <circle cx="520" cy="660" r="1.4" fill="#fff" opacity="0.85"><animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.5s" repeatCount="indefinite" /></circle>
      <circle cx="690" cy="740" r="1.2" fill="#e0f2fe" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="860" cy="680" r="1.5" fill="#fff" opacity="0.9"><animate attributeName="opacity" values="0.5;0.9;0.5" dur="3.8s" repeatCount="indefinite" /></circle>
      <circle cx="1030" cy="760" r="1.3" fill="#bae6fd" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.3s" repeatCount="indefinite" /></circle>
      <circle cx="1200" cy="640" r="1.1" fill="#fff" opacity="0.75"><animate attributeName="opacity" values="0.35;0.75;0.35" dur="2.9s" repeatCount="indefinite" /></circle>
      <circle cx="1370" cy="720" r="1.4" fill="#e0f2fe" opacity="0.85"><animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.6s" repeatCount="indefinite" /></circle>
      <circle cx="1540" cy="660" r="1.2" fill="#fff" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.1s" repeatCount="indefinite" /></circle>
      <circle cx="1710" cy="740" r="1.3" fill="#bae6fd" opacity="0.8"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.2s" repeatCount="indefinite" /></circle>
      <circle cx="1860" cy="680" r="1.1" fill="#fff" opacity="0.75"><animate attributeName="opacity" values="0.35;0.75;0.35" dur="2.7s" repeatCount="indefinite" /></circle>
    </g>

    <!-- ========== 第5层：十字星芒（少量大星，脉冲 + 十字光芒） ========== -->
    <g class="flare-stars" filter="url(#strongGlow)">
      <!-- 大星1：左上 -->
      <g transform="translate(250, 220)">
        <circle r="2.5" fill="#fff">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;2.8;2" dur="4s" repeatCount="indefinite" />
        </circle>
        <line x1="-14" y1="0" x2="14" y2="0" stroke="#fff" stroke-width="0.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#fff" stroke-width="0.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
        </line>
      </g>
      <!-- 大星2：中上 -->
      <g transform="translate(880, 160)">
        <circle r="3" fill="#e0f2fe">
          <animate attributeName="opacity" values="0.65;1;0.65" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="2.2;3.2;2.2" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <line x1="-18" y1="0" x2="18" y2="0" stroke="#e0f2fe" stroke-width="0.6" opacity="0.55">
          <animate attributeName="opacity" values="0.35;0.75;0.35" dur="4.5s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="-18" x2="0" y2="18" stroke="#e0f2fe" stroke-width="0.6" opacity="0.55">
          <animate attributeName="opacity" values="0.35;0.75;0.35" dur="4.5s" repeatCount="indefinite" />
        </line>
      </g>
      <!-- 大星3：右中 -->
      <g transform="translate(1660, 480)">
        <circle r="2.8" fill="#fff">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3.8s" repeatCount="indefinite" />
          <animate attributeName="r" values="2.2;3;2.2" dur="3.8s" repeatCount="indefinite" />
        </circle>
        <line x1="-16" y1="0" x2="16" y2="0" stroke="#fff" stroke-width="0.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.8s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="-16" x2="0" y2="16" stroke="#fff" stroke-width="0.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.8s" repeatCount="indefinite" />
        </line>
      </g>
      <!-- 大星4：左下 -->
      <g transform="translate(420, 880)">
        <circle r="2.5" fill="#bae6fd">
          <animate attributeName="opacity" values="0.55;0.95;0.55" dur="4.2s" repeatCount="indefinite" />
          <animate attributeName="r" values="2;2.8;2" dur="4.2s" repeatCount="indefinite" />
        </circle>
        <line x1="-14" y1="0" x2="14" y2="0" stroke="#bae6fd" stroke-width="0.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.65;0.3" dur="4.2s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#bae6fd" stroke-width="0.5" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.65;0.3" dur="4.2s" repeatCount="indefinite" />
        </line>
      </g>
      <!-- 大星5：中下偏右 -->
      <g transform="translate(1280, 820)">
        <circle r="3" fill="#fff">
          <animate attributeName="opacity" values="0.65;1;0.65" dur="4.6s" repeatCount="indefinite" />
          <animate attributeName="r" values="2.4;3.4;2.4" dur="4.6s" repeatCount="indefinite" />
        </circle>
        <line x1="-18" y1="0" x2="18" y2="0" stroke="#fff" stroke-width="0.6" opacity="0.55">
          <animate attributeName="opacity" values="0.35;0.75;0.35" dur="4.6s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="-18" x2="0" y2="18" stroke="#fff" stroke-width="0.6" opacity="0.55">
          <animate attributeName="opacity" values="0.35;0.75;0.35" dur="4.6s" repeatCount="indefinite" />
        </line>
      </g>
    </g>

    <!-- ========== 第6层：行星（带光环，缓慢旋转） ========== -->
    <g class="planet-layer" transform="translate(1620, 240)">
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="120s" repeatCount="indefinite" />
        <!-- 光环（后半，被行星遮挡的部分用透明度区分） -->
        <ellipse cx="0" cy="0" rx="85" ry="22" fill="none" stroke="url(#planetRing)" stroke-width="6" opacity="0.7" transform="rotate(-18)" />
        <ellipse cx="0" cy="0" rx="78" ry="19" fill="none" stroke="url(#planetRing)" stroke-width="2.5" opacity="0.5" transform="rotate(-18)" />
      </g>
      <!-- 行星本体 -->
      <circle cx="0" cy="0" r="42" fill="url(#planetBody)" />
      <!-- 行星表面纹理（云带） -->
      <ellipse cx="-8" cy="-10" rx="32" ry="5" fill="#7dd3fc" opacity="0.25" />
      <ellipse cx="6" cy="6" rx="30" ry="4" fill="#0ea5e9" opacity="0.2" />
      <ellipse cx="-4" cy="18" rx="28" ry="3.5" fill="#38bdf8" opacity="0.18" />
      <!-- 光环（前半，覆盖在行星前） -->
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="120s" repeatCount="indefinite" />
        <path d="M -85 0 A 85 22 0 0 0 85 0" fill="none" stroke="url(#planetRing)" stroke-width="6" opacity="0.85" transform="rotate(-18)" />
        <path d="M -78 0 A 78 19 0 0 0 78 0" fill="none" stroke="url(#planetRing)" stroke-width="2.5" opacity="0.6" transform="rotate(-18)" />
      </g>
      <!-- 行星高光 -->
      <circle cx="-14" cy="-14" r="10" fill="#e0f2fe" opacity="0.3" filter="url(#softBlur)" />
    </g>

    <!-- ========== 第7层：流星（统一从右上向左下飞，拖尾在后方） ========== -->
    <g class="meteor-layer">
      <!-- 流星1：从右上向左下，拖尾在右上方（后方） -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="1920,80; -300,500" dur="6s" repeatCount="indefinite" keyTimes="0;1" calcMode="linear" />
        <animate attributeName="opacity" values="0;0;1;1;0;0" dur="6s" repeatCount="indefinite" keyTimes="0;0.1;0.2;0.7;0.9;1" />
        <line x1="0" y1="0" x2="120" y2="-32" stroke="url(#meteorTrail)" stroke-width="2" stroke-linecap="round" />
        <circle cx="0" cy="0" r="2" fill="#fff" filter="url(#strongGlow)" />
      </g>
      <!-- 流星2：从右上向左下，拖尾在右上方（后方） -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="1900,300; -250,680" dur="8s" repeatCount="indefinite" begin="2s" keyTimes="0;1" calcMode="linear" />
        <animate attributeName="opacity" values="0;0;1;1;0;0" dur="8s" repeatCount="indefinite" begin="2s" keyTimes="0;0.08;0.15;0.75;0.92;1" />
        <line x1="0" y1="0" x2="140" y2="-38" stroke="url(#meteorTrail2)" stroke-width="1.8" stroke-linecap="round" />
        <circle cx="0" cy="0" r="1.8" fill="#bae6fd" filter="url(#strongGlow)" />
      </g>
      <!-- 流星3：从右上向左下（统一方向），拖尾在右上方（后方） -->
      <g>
        <animateTransform attributeName="transform" type="translate" values="1800,150; -350,580" dur="7s" repeatCount="indefinite" begin="4s" keyTimes="0;1" calcMode="linear" />
        <animate attributeName="opacity" values="0;0;1;1;0;0" dur="7s" repeatCount="indefinite" begin="4s" keyTimes="0;0.1;0.2;0.7;0.9;1" />
        <line x1="0" y1="0" x2="130" y2="-34" stroke="url(#meteorTrail)" stroke-width="1.6" stroke-linecap="round" />
        <circle cx="0" cy="0" r="1.5" fill="#fff" filter="url(#strongGlow)" />
      </g>
    </g>

    <!-- ========== 第8层：宇宙尘埃（细小颗粒，缓慢漂浮） ========== -->
    <g class="dust-layer" opacity="0.6">
      <circle cx="150" cy="400" r="0.3" fill="#7dd3fc"><animate attributeName="cy" values="400;406;400" dur="10s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.5;0.2" dur="6s" repeatCount="indefinite" /></circle>
      <circle cx="320" cy="600" r="0.4" fill="#a78bfa"><animate attributeName="cy" values="600;594;600" dur="12s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.15;0.45;0.15" dur="7s" repeatCount="indefinite" /></circle>
      <circle cx="500" cy="450" r="0.3" fill="#7dd3fc"><animate attributeName="cy" values="450;455;450" dur="11s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.5;0.2" dur="5.5s" repeatCount="indefinite" /></circle>
      <circle cx="680" cy="650" r="0.35" fill="#f472b6"><animate attributeName="cy" values="650;644;650" dur="13s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.15;0.4;0.15" dur="6.5s" repeatCount="indefinite" /></circle>
      <circle cx="850" cy="500" r="0.3" fill="#7dd3fc"><animate attributeName="cy" values="500;506;500" dur="10s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.5;0.2" dur="6s" repeatCount="indefinite" /></circle>
      <circle cx="1020" cy="420" r="0.4" fill="#a78bfa"><animate attributeName="cy" values="420;414;420" dur="14s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.15;0.45;0.15" dur="7s" repeatCount="indefinite" /></circle>
      <circle cx="1190" cy="620" r="0.3" fill="#7dd3fc"><animate attributeName="cy" values="620;626;620" dur="11s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.5;0.2" dur="5.5s" repeatCount="indefinite" /></circle>
      <circle cx="1360" cy="480" r="0.35" fill="#fbbf24"><animate attributeName="cy" values="480;474;480" dur="12s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.15;0.4;0.15" dur="6.5s" repeatCount="indefinite" /></circle>
      <circle cx="1530" cy="580" r="0.3" fill="#7dd3fc"><animate attributeName="cy" values="580;586;580" dur="10s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.5;0.2" dur="6s" repeatCount="indefinite" /></circle>
      <circle cx="1700" cy="440" r="0.4" fill="#a78bfa"><animate attributeName="cy" values="440;434;440" dur="13s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.15;0.45;0.15" dur="7s" repeatCount="indefinite" /></circle>
      <circle cx="240" cy="780" r="0.3" fill="#7dd3fc"><animate attributeName="cy" values="780;785;780" dur="11s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.5;0.2" dur="5.5s" repeatCount="indefinite" /></circle>
      <circle cx="600" cy="860" r="0.35" fill="#f472b6"><animate attributeName="cy" values="860;854;860" dur="12s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.15;0.4;0.15" dur="6.5s" repeatCount="indefinite" /></circle>
      <circle cx="960" cy="800" r="0.3" fill="#7dd3fc"><animate attributeName="cy" values="800;806;800" dur="10s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.5;0.2" dur="6s" repeatCount="indefinite" /></circle>
      <circle cx="1320" cy="880" r="0.4" fill="#a78bfa"><animate attributeName="cy" values="880;874;880" dur="14s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.15;0.45;0.15" dur="7s" repeatCount="indefinite" /></circle>
      <circle cx="1680" cy="820" r="0.3" fill="#7dd3fc"><animate attributeName="cy" values="820;826;820" dur="11s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.2;0.5;0.2" dur="5.5s" repeatCount="indefinite" /></circle>
    </g>
  </svg>
</template>

<style scoped>
  .starfield-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>