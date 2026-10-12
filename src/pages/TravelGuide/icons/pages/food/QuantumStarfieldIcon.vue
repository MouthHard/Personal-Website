<script setup lang="ts">
  defineProps<{
    class?: string;
  }>();
</script>

<template>
  <svg
    class="quantum-starfield"
    viewBox="0 0 400 120"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="qs-nebula-cyan" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.22" />
        <stop offset="100%" stop-color="#00f0ff" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="qs-nebula-blue" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#0096ff" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#0096ff" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="qs-nebula-soft" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#7df9ff" stop-opacity="0.14" />
        <stop offset="100%" stop-color="#7df9ff" stop-opacity="0" />
      </radialGradient>
    </defs>

    <ellipse cx="55" cy="45" rx="80" ry="42" fill="url(#qs-nebula-cyan)" />
    <ellipse cx="200" cy="75" rx="98" ry="46" fill="url(#qs-nebula-blue)" />
    <ellipse cx="340" cy="32" rx="72" ry="36" fill="url(#qs-nebula-soft)" />

    <g fill="none" stroke="#00f0ff" stroke-opacity="0.07" stroke-width="0.4">
      <path d="M 10 112 Q 60 58 110 112" />
      <path d="M 30 112 Q 80 78 130 112" />
      <path d="M 280 112 Q 330 68 380 112" />
    </g>

    <g transform="translate(360, 26)">
      <circle r="46" fill="none" stroke="#00f0ff" stroke-opacity="0.07" stroke-width="0.4" />
      <circle r="32" fill="none" stroke="#00f0ff" stroke-opacity="0.1" stroke-width="0.4" />
      <circle r="18" fill="none" stroke="#00f0ff" stroke-opacity="0.14" stroke-width="0.4" />
      <circle r="1.3" fill="#7df9ff" fill-opacity="0.75" />
      <line x1="0" y1="0" x2="46" y2="0" stroke="#00f0ff" stroke-opacity="0.32" stroke-width="0.6">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0"
          to="360"
          dur="6s"
          repeatCount="indefinite"
        />
      </line>
    </g>

    <g transform="translate(36, 102)">
      <circle r="20" fill="none" stroke="#00f0ff" stroke-opacity="0.09" stroke-width="0.4" />
      <circle r="10" fill="none" stroke="#00f0ff" stroke-opacity="0.13" stroke-width="0.4" />
      <circle r="0.9" fill="#7df9ff" fill-opacity="0.65" />
      <line x1="0" y1="0" x2="20" y2="0" stroke="#00f0ff" stroke-opacity="0.26" stroke-width="0.5">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360"
          to="0"
          dur="8s"
          repeatCount="indefinite"
        />
      </line>
    </g>

    <g fill="none" stroke="#00f0ff" stroke-opacity="0.12" stroke-width="0.4">
      <polygon points="150,14 159,19 159,29 150,34 141,29 141,19" />
      <polygon points="252,88 258,91 258,97 252,100 246,97 246,91" />
    </g>

    <g fill="#7df9ff">
      <circle cx="15" cy="18" r="0.5" opacity="0.4" />
      <circle cx="32" cy="45" r="0.9" opacity="0.6" class="qs-twinkle-a" />
      <circle cx="48" cy="12" r="0.4" opacity="0.3" />
      <circle cx="68" cy="75" r="0.6" opacity="0.5" class="qs-twinkle-b" />
      <circle cx="88" cy="35" r="0.5" opacity="0.4" />
      <circle cx="112" cy="92" r="0.7" opacity="0.5" class="qs-twinkle-a" />
      <circle cx="140" cy="22" r="0.4" opacity="0.3" />
      <circle cx="165" cy="55" r="0.6" opacity="0.5" />
      <circle cx="195" cy="82" r="0.5" opacity="0.4" class="qs-twinkle-b" />
      <circle cx="225" cy="18" r="0.8" opacity="0.6" class="qs-twinkle-a" />
      <circle cx="255" cy="62" r="0.4" opacity="0.3" />
      <circle cx="285" cy="28" r="0.6" opacity="0.5" class="qs-twinkle-b" />
      <circle cx="315" cy="88" r="0.5" opacity="0.4" />
      <circle cx="345" cy="48" r="0.4" opacity="0.3" class="qs-twinkle-a" />
      <circle cx="380" cy="80" r="0.6" opacity="0.5" />
      <circle cx="100" cy="60" r="0.3" opacity="0.25" class="qs-twinkle-c" />
      <circle cx="180" cy="30" r="0.35" opacity="0.3" />
      <circle cx="210" cy="50" r="0.45" opacity="0.4" class="qs-twinkle-c" />
      <circle cx="240" cy="100" r="0.3" opacity="0.25" />
      <circle cx="270" cy="15" r="0.4" opacity="0.35" class="qs-twinkle-a" />
      <circle cx="300" cy="55" r="0.35" opacity="0.3" />
      <circle cx="330" cy="20" r="0.45" opacity="0.4" class="qs-twinkle-b" />
      <circle cx="365" cy="65" r="0.3" opacity="0.25" />
      <circle cx="20" cy="80" r="0.4" opacity="0.35" class="qs-twinkle-c" />
      <circle cx="60" cy="100" r="0.35" opacity="0.3" />
      <circle cx="125" cy="40" r="0.45" opacity="0.4" class="qs-twinkle-a" />
      <circle cx="155" cy="85" r="0.3" opacity="0.25" />
      <circle cx="185" cy="65" r="0.4" opacity="0.35" class="qs-twinkle-b" />
      <circle cx="220" cy="75" r="0.35" opacity="0.3" />
      <circle cx="260" cy="40" r="0.45" opacity="0.4" class="qs-twinkle-c" />
      <circle cx="295" cy="95" r="0.3" opacity="0.25" />
    </g>

    <g stroke="#00f0ff" stroke-opacity="0.11" stroke-width="0.3" fill="none">
      <line x1="32" y1="45" x2="68" y2="75" />
      <line x1="68" y1="75" x2="112" y2="92" />
      <line x1="112" y1="92" x2="165" y2="55" />
      <line x1="165" y1="55" x2="195" y2="82" />
      <line x1="225" y1="18" x2="255" y2="62" />
      <line x1="255" y1="62" x2="285" y2="28" />
      <line x1="285" y1="28" x2="315" y2="88" />
      <line x1="125" y1="40" x2="165" y2="55" />
      <line x1="210" y1="50" x2="260" y2="40" />
      <line x1="260" y1="40" x2="285" y2="28" />
    </g>

    <g fill="#00f0ff" fill-opacity="0.45">
      <rect x="90" y="48" width="1.6" height="1.6" />
      <rect x="230" y="88" width="1.6" height="1.6" />
      <rect x="320" y="60" width="1.6" height="1.6" />
    </g>

    <g fill="none" stroke="#00f0ff" stroke-opacity="0.18" stroke-width="0.4">
      <path d="M 140 108 L 145 105 L 150 108 L 155 102 L 160 108 L 165 106 L 170 108" />
      <path d="M 200 108 L 205 104 L 210 108 L 215 101 L 220 108 L 225 105 L 230 108" />
    </g>

    <g stroke="#00f0ff" stroke-opacity="0.13" stroke-width="0.4">
      <line x1="20" y1="114" x2="28" y2="114" />
      <line x1="42" y1="114" x2="46" y2="114" />
      <line x1="64" y1="114" x2="76" y2="114" />
      <line x1="96" y1="114" x2="100" y2="114" />
      <line x1="128" y1="114" x2="136" y2="114" />
      <line x1="168" y1="114" x2="172" y2="114" />
      <line x1="208" y1="114" x2="220" y2="114" />
      <line x1="248" y1="114" x2="252" y2="114" />
      <line x1="280" y1="114" x2="288" y2="114" />
      <line x1="310" y1="114" x2="314" y2="114" />
    </g>

    <g stroke="#00f0ff" stroke-opacity="0.22" stroke-width="0.4">
      <line x1="8" y1="8" x2="14" y2="8" />
      <line x1="8" y1="8" x2="8" y2="14" />
    </g>
  </svg>
</template>

<style>
  .qs-twinkle-a {
    animation: qs-twinkle-a 3.5s ease-in-out infinite;
  }
  .qs-twinkle-b {
    animation: qs-twinkle-b 4.2s ease-in-out infinite;
  }
  .qs-twinkle-c {
    animation: qs-twinkle-c 5s ease-in-out infinite;
  }
  @keyframes qs-twinkle-a {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 0.95;
    }
  }
  @keyframes qs-twinkle-b {
    0%,
    100% {
      opacity: 0.35;
    }
    50% {
      opacity: 0.85;
    }
  }
  @keyframes qs-twinkle-c {
    0%,
    100% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.7;
    }
  }
</style>