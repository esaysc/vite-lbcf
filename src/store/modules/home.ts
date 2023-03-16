import { defineStore } from 'pinia' // pinia
import { reactive } from 'vue'
import { http } from '@/utils/request'

const useHomeStore = defineStore('home', {
  state: () => ({
    categoryList: [],
    userLists: [],
    user: {
      token: '',
    },
    userInfo: reactive({
      success: '',
      code: 0,
      token: '',
      message: '',
    }),
  }),
  actions: {
    // 测试获取信息
    async info() {
      await http('GET', '/user/info').then((res: any) => {
        console.log('info:', res.data)
      })
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ['categoryList', 'userLists', 'user', 'userInfo'],
  },
})

export default useHomeStore
