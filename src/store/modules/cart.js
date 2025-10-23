import { cartapi } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      cartTotal: 0,
      cartList: []
    }
  },
  mutations: {
    setTotal (state, newTotal) {
      state.cartTotal = newTotal
    },
    setCartList (state, newList) {
      state.cartList = newList
    },
    // 改变某一个的勾选状态
    changeChecked (state, id) {
      const goods = state.cartList.find(item => item.goods_id === id)
      goods.checked = !goods.checked
    },
    // 全部勾选 / 全部不勾选
    changeAllChecked (state, status) {
      state.cartList.forEach(item => {
        item.checked = status
      })
    }
  },
  // 异步获取购物车列表
  actions: {
    // 获取更新购物车总数
    async getTotalAction (context) {
      const res = await cartapi.getTotal()
      context.commit('setTotal', res.data.cartTotal)
    },
    // 获取购物车列表
    async getCartAction (context) {
      const { data } = await cartapi.getList()
      // 全部勾选
      data.list.forEach(item => { item.checked = false })
      context.commit('setCartList', data.list)
      context.commit('setTotal', data.cartTotal)
    },
    async deleteAction (context, delCartsId) {
      // 删除并且获取最新列表
      await cartapi.deleteGoods(delCartsId)
      await context.dispatch('getCartAction')
    }
  },
  getters: {
    // 选中的商品列表
    selCartList (state) {
      return state.cartList.filter(item => item.checked)
    },
    // 选中的商品列表的购物车id
    selCartId (state, getters) {
      return getters.selCartList.map(item => item.id)
    },
    // 选中的商品数量
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },
    // 是否全选
    isAllChecked (state) {
      return state.cartList.every(item => item.checked)
    }
  }
}
