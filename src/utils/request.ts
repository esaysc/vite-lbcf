import axios, { type Method } from 'axios'
const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // const token = home.user.token
    const token = window.sessionStorage.getItem('token')
    // 判断token是否存在
    if (token) {
      // console.log('成功拦截请求', token)
      // config.headers!.Authorization = `Bearer ${token}`
      // config.headers!['Authorization'] = 'bearer'.concat(token)
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.log('有误')

    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    if (response.status != 200) {
      console.log('code:', response.data.code)
      return Promise.reject(response.data)
    } else {
      return response
    }
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 后端返回的接口数据格式
interface ApiRes<T = unknown> {
  msg: string
  result: T
}

/**
 * axios 二次封装，整合 TS 类型
 * @param url  请求地址
 * @param method  请求类型
 * @param submitData  对象类型，提交数据
 */
export const http = <T>(method: Method, url: string, submitData?: object) => {
  return instance.request({
    url,
    method,
    // 🔔 自动设置合适的 params/data 键名称，如果 method 为 get 用 params 传请求参数，否则用 data
    [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData,
  })
}

export default instance
