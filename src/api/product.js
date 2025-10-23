import request from '@/utils/requests'

export const prodapi = {
  // 获取商品列表
  getList (keyword, sortType) {
    return request({
      method: 'GET',
      url: '/goods/list',
      query: {
        sortType,
        categoryId: '0',
        goodsName: keyword,
        page: 1
      }
    })
  },
  // 获取商品详细信息
  getDetail (id) {
    return request({
      method: 'GET',
      url: '/goods/detail',
      params: {
        goodsId: id
      }
    })
  },
  // 获取商品评论
  getComment (id, count = 5) {
    return request({
      method: 'GET',
      url: '/comment/listRows',
      params: {
        goodsId: id,
        limit: count
      }
    })
  },
  // 获取商品保障服务
  getService (id) {
    return request({
      method: 'GET',
      url: '/goods.service/list',
      params: {
        goodsId: id
      }
    })
  }
}
