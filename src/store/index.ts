import type { App } from 'vue'
import { createPinia } from 'pinia' // pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // pinia 持久化插件 npm i pinia-plugin-persistedstate
const store = createPinia() // 创建pinia仓库
store.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state)) // 初始状态为深拷贝的原始状态对象
  // 创建重置函数
  store.$reset = () => {
    store.$state = JSON.parse(JSON.stringify(initialState))
  }
})
store.use(piniaPluginPersistedstate) // 使用持久化插件
// 导出函数 在main.ts中调用 用以启用仓库
export function setupStore(app: App<Element>) {
  app.use(store)
}

export { store }
