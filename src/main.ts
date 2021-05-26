import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css'
import axios from "@/api/api.ts";

const app = createApp(App)
app.use(store)
app.use(router)
app.use(elementPlus)
app.config.globalProperties.axios = axios;
app.mount('#app')
