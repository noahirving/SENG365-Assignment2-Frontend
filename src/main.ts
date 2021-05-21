import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import elementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css'


const app = createApp(App)
app.use(store)
app.use(router)
app.use(elementPlus)
axios.defaults.baseURL = 'http://localhost:4941/api/v1/';
axios.defaults.headers.common['X-Authorization'] = null;
app.config.globalProperties.axios = axios;
app.mount('#app')
