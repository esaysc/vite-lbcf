import './style.css'
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router' // 启动路由
import { setupStore } from './store' // 设置pinia仓库

const app = createApp(App)
setupStore(app)
app.use(router)
app.mount('#app')
