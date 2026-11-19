// 自定义诗词主题消息弹窗（深色毛玻璃发光风格·替换 ElMessage）

type MessageType = 'success' | 'info' | 'error' | 'warning';

const MESSAGE_Z_INDEX = 11000;
const MESSAGE_DURATION = 3000;

// SVG 图标映射（白色描边·适配深色背景）
const MESSAGE_ICONS: Record<MessageType, string> = {
  // 竹叶（成功·点赞/收藏/喜爱成功）
  success: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="#e8f5e9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 6 C 18 14, 14 22, 12 36" />
    <path d="M24 6 C 30 14, 34 22, 36 36" />
    <path d="M16 18 C 12 16, 8 14, 6 12 C 10 18, 14 20, 18 20" fill="#e8f5e9" fill-opacity="0.25" />
    <path d="M32 18 C 36 16, 40 14, 42 12 C 38 18, 34 20, 30 20" fill="#e8f5e9" fill-opacity="0.25" />
    <path d="M18 26 C 14 24, 10 22, 8 20 C 12 26, 16 28, 20 28" fill="#e8f5e9" fill-opacity="0.25" />
    <path d="M30 26 C 34 24, 38 22, 40 20 C 36 26, 32 28, 28 28" fill="#e8f5e9" fill-opacity="0.25" />
  </svg>`,
  // 水波纹（信息·取消操作）
  info: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="#e3f2fd" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 16 Q 12 10, 18 16 T 30 16 T 42 16" />
    <path d="M6 24 Q 12 18, 18 24 T 30 24 T 42 24" />
    <path d="M6 32 Q 12 26, 18 32 T 30 32 T 42 32" />
  </svg>`,
  // 印章叉号（错误·操作失败）
  error: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="#ffebee" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="8" y="8" width="32" height="32" rx="3" stroke-width="2" stroke-opacity="0.4" />
    <path d="M16 16 L 32 32" />
    <path d="M32 16 L 16 32" />
  </svg>`,
  // 感叹号（警告·提醒注意）
  warning: `<svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="#fff3e0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 8 L 24 28" />
    <circle cx="24" cy="36" r="3" fill="#fff3e0" fill-opacity="0.7" stroke="none" />
    <path d="M14 40 Q 24 4, 34 40" stroke-opacity="0.25" stroke-width="2" />
  </svg>`,
};

// 关闭按钮 SVG（简约线条风格·适配深色毛玻璃）
const CLOSE_ICON_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 6 L 18 18" />
  <path d="M18 6 L 6 18" />
</svg>`;

let containerEl: HTMLElement | null = null;
let styleInjected = false;

const injectStyles = () => {
  if (styleInjected) return;
  styleInjected = true;

  const style = document.createElement('style');
  style.setAttribute('data-poem-message', '');
  style.textContent = `
    #poem-message-container {
      position: fixed;
      top: 32px;
      left: 50%;
      transform: translateX(-50%);
      z-index: ${MESSAGE_Z_INDEX};
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      pointer-events: none;
    }

    .poem-msg {
      pointer-events: auto;
      display: flex;
      align-items: stretch;
      min-width: 380px;
      max-width: 560px;
      border-radius: 14px;
      overflow: hidden;
      position: relative;
      animation: poemMsgSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      background: rgba(18, 18, 28, 0.82);
      backdrop-filter: blur(24px) saturate(140%);
      -webkit-backdrop-filter: blur(24px) saturate(140%);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .poem-msg.success {
      box-shadow:
        0 0 0 1px rgba(76, 175, 80, 0.2),
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 24px rgba(76, 175, 80, 0.15);
    }

    .poem-msg.info {
      box-shadow:
        0 0 0 1px rgba(66, 165, 245, 0.2),
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 24px rgba(66, 165, 245, 0.15);
    }

    .poem-msg.error {
      box-shadow:
        0 0 0 1px rgba(239, 83, 80, 0.2),
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 24px rgba(239, 83, 80, 0.15);
    }

    .poem-msg.warning {
      box-shadow:
        0 0 0 1px rgba(255, 183, 77, 0.2),
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 24px rgba(255, 183, 77, 0.15);
    }

    .poem-msg.closing {
      animation: poemMsgSlideOut 0.3s ease-in forwards;
    }

    @keyframes poemMsgSlideIn {
      0% {
        opacity: 0;
        transform: translateY(-40px) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes poemMsgSlideOut {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(-30px) scale(0.95);
      }
    }

    // 左侧 SVG 图标容器（发光圆形）
    .poem-msg-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      flex-shrink: 0;
      position: relative;
    }

    .poem-msg-icon::before {
      content: "";
      position: absolute;
      inset: 16px;
      border-radius: 12px;
    }

    .poem-msg-icon.success::before {
      background: rgba(76, 175, 80, 0.18);
      box-shadow:
        inset 0 0 0 1px rgba(76, 175, 80, 0.35),
        0 0 16px rgba(76, 175, 80, 0.2);
    }

    .poem-msg-icon.info::before {
      background: rgba(66, 165, 245, 0.18);
      box-shadow:
        inset 0 0 0 1px rgba(66, 165, 245, 0.35),
        0 0 16px rgba(66, 165, 245, 0.2);
    }

    .poem-msg-icon.error::before {
      background: rgba(239, 83, 80, 0.18);
      box-shadow:
        inset 0 0 0 1px rgba(239, 83, 80, 0.35),
        0 0 16px rgba(239, 83, 80, 0.2);
    }

    .poem-msg-icon.warning::before {
      background: rgba(255, 183, 77, 0.18);
      box-shadow:
        inset 0 0 0 1px rgba(255, 183, 77, 0.35),
        0 0 16px rgba(255, 183, 77, 0.2);
    }

    // 右侧消息内容区
    .poem-msg-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 28px;
      min-height: 80px;
    }

    .poem-msg-text {
      font-family: "STKaiti", "KaiTi", "Noto Serif SC", serif;
      font-size: 22px;
      font-weight: bolder;
      color: rgba(255, 255, 255, 0.92);
      letter-spacing: 1.5px;
      line-height: 1.6;
      text-align: center;
      white-space: normal;
      word-break: break-word;
      flex: 1;
    }

    .poem-msg.success .poem-msg-text {
      text-shadow: 0 0 12px rgba(76, 175, 80, 0.3);
    }

    .poem-msg.info .poem-msg-text {
      text-shadow: 0 0 12px rgba(66, 165, 245, 0.3);
    }

    .poem-msg.error .poem-msg-text {
      text-shadow: 0 0 12px rgba(239, 83, 80, 0.3);
    }

    .poem-msg.warning .poem-msg-text {
      text-shadow: 0 0 12px rgba(255, 183, 77, 0.3);
    }

    // 关闭按钮（毛玻璃圆形）
    .poem-msg-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      margin-left: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      color: rgba(255, 255, 255, 0.5);
      transition: all 0.25s ease;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .poem-msg-close:hover {
      color: rgba(255, 255, 255, 0.9);
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .poem-msg-close:active {
      transform: scale(0.95);
      background: rgba(255, 255, 255, 0.04);
    }
  `;

  document.head.appendChild(style);
};

const getContainer = (): HTMLElement => {
  if (containerEl && document.body.contains(containerEl)) {
    return containerEl;
  }
  containerEl = document.createElement('div');
  containerEl.id = 'poem-message-container';
  document.body.appendChild(containerEl);
  return containerEl;
};

const showMessage = (type: MessageType, message: string) => {
  injectStyles();
  const container = getContainer();

  const msgEl = document.createElement('div');
  msgEl.className = `poem-msg ${type}`;

  const iconSvg = MESSAGE_ICONS[type];

  msgEl.innerHTML = `
    <div class="poem-msg-icon ${type}">
      ${iconSvg}
    </div>
    <div class="poem-msg-body">
      <span class="poem-msg-text">${message}</span>
      <button class="poem-msg-close" aria-label="关闭">
        ${CLOSE_ICON_SVG}
      </button>
    </div>
  `;

  container.appendChild(msgEl);

  const closeMsg = () => {
    msgEl.classList.add('closing');
    setTimeout(() => {
      if (msgEl.parentNode) {
        msgEl.parentNode.removeChild(msgEl);
      }
    }, 300);
  };

  // 自动关闭
  const autoCloseTimer = setTimeout(closeMsg, MESSAGE_DURATION);

  // 鼠标悬停关闭
  msgEl.addEventListener('mouseenter', () => {
    clearTimeout(autoCloseTimer);
    closeMsg();
  });

  // 点击关闭按钮
  const closeBtn = msgEl.querySelector('.poem-msg-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      clearTimeout(autoCloseTimer);
      closeMsg();
    });
  }

  return { close: closeMsg };
};

export const poemMessage = {
  success: (message: string) => showMessage('success', message),
  info: (message: string) => showMessage('info', message),
  error: (message: string) => showMessage('error', message),
  warning: (message: string) => showMessage('warning', message),
};
