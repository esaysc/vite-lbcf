// index.ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// 添加类型校验
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/HelloWorld.vue'),
  },
  {
    path: '/logIn',
    name: 'logIn',
    component: () => import('@/view/LogIn.vue'),
  },
]
// 创建router
const router = createRouter({
  // 配置为Hash模式
  history: createWebHashHistory(),
  // 配置toures
  routes,
  // 路由跳转时返回顶部
  scrollBehavior() {
    return { top: 0 }
  },
})

// 设置前置路由守卫
router.beforeEach((to, from, next) => {
  next()
})

// 设置后置路由守卫
router.afterEach((to, from, failure) => {})

export { router }
