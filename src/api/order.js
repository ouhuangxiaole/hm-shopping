import request from '@/utils/requests'

export const orderapi = {
  // 获取订单列表
  getList (type, page = 1) {
    return request.get('/order/list', {
      params: {
        dataType: type,
        page
      }
    })
  },
  // 获取各个类型订单数量
  getCounts () {
    return request.get('/order/todoCounts')
  }
}
