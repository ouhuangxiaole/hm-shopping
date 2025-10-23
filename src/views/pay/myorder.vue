<template>
  <div class="order">
    <van-nav-bar title="我的订单" fixed left-arrow @click-left="$router.back()" />
    <van-tabs sticky="1" v-model="type">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待支付" name="payment"></van-tab>
      <van-tab title="待发货" name="delivery"></van-tab>
      <van-tab title="待收货" name="received"></van-tab>
      <van-tab title="待评价" name="comment"></van-tab>
    </van-tabs>

    <!-- 购物车为空 -->
    <van-empty
      v-if="isLogin && orderList.length === 0"
      :image="require('@/assets/empty.png')"
      description="空空如也"
    >
    </van-empty>

    <OrderListItem v-else
      v-for="order in orderList"
      :key="order.order_id"
      :order="order"
      :list="order.goods"
    ></OrderListItem>

  </div>
</template>

<script>
import { orderapi } from '@/api/order'
import OrderListItem from '@/components/OrderListItem.vue'
export default {
  name: 'OrderPage',
  components: {
    OrderListItem
  },
  data () {
    return {
      type: '',
      orderList: []
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.user.userInfo.token
    }
  },
  watch: {
    async type () {
      if (this.isLogin) {
        const res = await orderapi.getList(this.type)
        this.orderList = res.data.list.data
        console.log(this.orderList)
      }
      // await this.getOrderList(this.type)
    }
  },
  async created () {
    if (!this.isLogin) {
      this.$confirm(
        this.$route.fullPath,
        () => { this.$router.replace('/') }
      )
      return
    }
    this.type = this.$route.query.dataType || 'all'
    const res = await orderapi.getList(this.type)
    this.orderList = res.data.list.data
    // console.log(this.orderList)
  }
}
</script>

<style lang="less" scoped>
.order {
  background-color: #fafafa;
  position: relative;
  height: 100vh;
}
.van-tabs {
  position: sticky;
  margin-top: 46px;
}
</style>
