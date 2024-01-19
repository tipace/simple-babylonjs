import { createApp } from 'vue';
import router from './router';

import App from './App.vue';
import './style.css';

const vue = createApp(App);
vue.use(router);
vue.mount('#app');
