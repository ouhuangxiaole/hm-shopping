import { Dialog } from 'vant'
import router from '@/router'

export const confirm = (backUrl, cancelFunc) => {
  Dialog.confirm({
    title: '温馨提示',
    message: '此时需要先登录才能继续操作哦',
    confirmButtonText: '去登录',
    cancelButtonText: '再逛逛'
  }).then(() => {
    router.replace({
      path: '/login',
      query: {
        backUrl
      }
    })
  }).catch(cancelFunc)
}
