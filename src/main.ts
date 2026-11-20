import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import './composables/museum/message-styles.scss';
import './styles/global.scss';
import {
  ERROR_CODES,
  requestError,
} from './components/common/ErrorBoundary/channel';

const app = createApp(App);
const pinia = createPinia();

app.config.errorHandler = (err, instance, info) => {
  console.error('[GlobalError]', err, {
    component: instance?.$options?.name,
    info,
  });
  // ErrorBoundary 之外的最后兜底（例如 App.vue 本身出错）
  requestError({
    kind: 'runtime',
    code: ERROR_CODES.GLOBAL,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack || '' : '',
    component: info,
  });
};

window.addEventListener('unhandledrejection', (event) => {
  // 只记录不弹界面：浏览器插件与第三方脚本的拒绝不该盖住整站
  console.error('[UnhandledRejection]', event.reason);
});

router.onError((error) => {
  // 转交由 PageChange 统一做，保证 2.5s 动画播完再交棒
  console.error('[RouterError]', error);
});

app.use(pinia);
app.use(router);
app.mount('#app');
