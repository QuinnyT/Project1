
import '/static/main.css'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import Vue3TouchEvents from "vue3-touch-events";

import { createApp } from 'vue'
import App from './App.vue'


const app = createApp(App);
app.use(Vue3TouchEvents)
app.use(ElementPlus, {
    locale: zhCn,
})
app.mount('#app')