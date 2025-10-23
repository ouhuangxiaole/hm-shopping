import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'

const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 10000
  // headers: { 'X-Custom-Header': 'foobar' }
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 统一携带token
  const token = store.state.user.userInfo.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
    // 开启loading 节流处理
    Toast.loading({
      message: '请求中...',
      // 禁用背景点击
      forbidClick: true,
      duration: 0
    })
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // console.log(response.data)
  const res = response.data
  if (res.status !== 200) {
    // 错误信息弹窗
    console.log(res.message)
    Toast.fail(res.message)
    return Promise.reject(res.message)
  }
  Toast.clear()
  return res
}, function (error) {
  console.log(error)
  return Promise.reject(error)
})

export default instance
