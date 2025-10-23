import request from '@/utils/requests'

export const userapi = {
  // 获取个人信息
  getInfo () {
    return request.get('/user/info')
  },
  // 获取个人资产
  getAssets () {
    return request.get('/user/assets')
  }
}
