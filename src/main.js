import './assets/scss/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue3-loading-overlay';
import {
  Field, Form, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import {
  required, email, min, min_value as minValue, max_value as maxValue, length,
} from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
import { createMetaManager } from 'vue-meta';
import router from './router';
import App from './App.vue';
import { currency, date } from './methods/filters';
import emitter from './methods/emitter';

const app = createApp(App);
const meta = createMetaManager();

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('minValue', minValue);
defineRule('maxValue', maxValue);
defineRule('length', length);

configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true, // 當輸入任何內容直接進行驗證
});

setLocale('zh_TW');

app.use(createPinia());
app.use(VueAxios, axios);
app.use(meta);
app.use(router);
app.component('LoadingOverlay', Loading);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);
app.mount('#app');

app.config.globalProperties.$filters = { currency, date };
app.config.globalProperties.$emitter = emitter;
