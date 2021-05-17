import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';

const app = createApp(App)
app.use(store)
app.use(router)
axios.defaults.baseURL = 'http://localhost:4941/api/v1/';
app.config.globalProperties.axios = axios;
app.mount('#app')
