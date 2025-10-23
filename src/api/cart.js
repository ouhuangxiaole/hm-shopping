import request from '@/utils/requests'

export const cartapi = {
// 获取购物车商品总数
  getTotal () {
    return request.get('/cart/total')
  },
  // 获取购物车列表
  getList () {
    return request.get('/cart/list')
  },
  // 添加商品到购物车
  addCart (goodsId, count, goodsSkuId) {
    return request.post('/cart/add', {
      goodsId,
      goodsNum: count,
      goodsSkuId
    })
  },
  // 更新商品数量
  updateCount (goodsId, count, goodsSkuId) {
    return request.post('/cart/update', {
      goodsId,
      goodsNum: count,
      goodsSkuId
    })
  },
  // 删除选择的商品
  deleteGoods (cartIds) {
    return request.post('/cart/clear', {
      cartIds
    })
  }
}
