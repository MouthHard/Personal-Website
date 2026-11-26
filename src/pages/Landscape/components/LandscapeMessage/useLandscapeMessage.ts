import { createApp } from 'vue';
import LandscapeMessage from './index.vue';

type MessageType = 'success' | 'info' | 'error' | 'warning';

let messageInstance: InstanceType<typeof LandscapeMessage> | null = null;
let app: ReturnType<typeof createApp> | null = null;

const getInstance = () => {
  if (messageInstance) return messageInstance;

  const container = document.createElement('div');
  document.body.appendChild(container);

  app = createApp(LandscapeMessage);
  messageInstance = app.mount(container) as InstanceType<
    typeof LandscapeMessage
  >;

  return messageInstance;
};

const show = (type: MessageType, text: string) => {
  getInstance()[type](text);
};

export const useLandscapeMessage = () => {
  return {
    success: (text: string) => show('success', text),
    info: (text: string) => show('info', text),
    error: (text: string) => show('error', text),
    warning: (text: string) => show('warning', text),
  };
};
