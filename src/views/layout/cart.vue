<template>
  <div class="cart-box">
    <van-nav-bar title="购物车" fixed left-arrow @click-left="$router.back()" />

    <!-- 无商品的情况 -->
    <van-empty
      v-if="isLogin && cartList.length === 0"
      :image="require('@/assets/empty.png')"
      description="您的购物车是空的, 快去逛逛吧"
    >
    </van-empty>

    <div class="cart" v-else>
      <!-- 购物车开头 -->
      <div class="cart-title">
        <span class="all">
          共<i>{{ cartTotal }}</i>件商品
        </span>
        <span class="edit" @click="isEdit = !isEdit">
          <van-icon name="edit" />
          {{ isEdit ? '退出编辑' : '编辑'}}
        </span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div
          class="cart-item"
          v-for="item in cartList"
          :key="item.goods_id"
        >
          <van-checkbox
            :value="item.checked"
            :checked-color="!isEdit ? '#1989FA' : '#FA2F21'"
            @click="changeChecked(item.goods_id)"
          ></van-checkbox>
          <div class="show">
            <img :src="item.goods.goods_image" alt="">
          </div>
          <div class="info">
            <span class="tit text-ellipsis-2" v-html="item.goods.goods_name"></span>
            <span class="bottom">
              <div class="price">¥
                <span v-html="item.goods.goods_price_min"></span>
              </div>
              <van-stepper
                v-model="item.goods_num"
                @change="updateCount(item)"
              ></van-stepper>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-fixed">
        <div class="all-check">
          <van-checkbox
            icon-size="18"
            shape="square"
            :value="isAllChecked"
            :checked-color="!isEdit ? '#1989FA' : '#FA2F21'"
            @click="changeAllChecked(!isAllChecked)"
          ></van-checkbox>
          全选
        </div>

        <div class="all-total">
          <div class="price" v-if="!isEdit">
            <span>合计：</span>
            <span>¥ <i class="totalPrice" v-html="selPrice"></i></span>
          </div>
          <div
            v-if="!isEdit"
            class="goPay"
            :disabled="selCount === 0"
            :class="{ disabled: selCount === 0 }"
            @click="goPay"
          >
            结算({{ selCount }})
          </div>
          <div
            v-else
            class="delete"
            :disabled="selCount === 0"
            :class="{ disabled: selCount === 0 }"
            @click="deleteSel"
          >
            删除
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { cartapi } from '@/api/cart'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'CartPage',
  data () {
    return {
      isEdit: false
    }
  },
  computed: {
    ...mapState('cart', ['cartTotal', 'cartList']),
    ...mapGetters('cart', ['selCartId', 'selCartList', 'selCount', 'selPrice', 'isAllChecked']),
    isLogin () {
      return this.$store.state.user.userInfo.token
    }
  },
  watch: {
    isEdit (value) {
      if (value) {
        this.changeAllChecked(false)
      }
    }
  },
  methods: {
    ...mapMutations('cart', ['changeChecked', 'changeAllChecked']),
    // 更新购物车商品的数量
    async updateCount (goods) {
      // this.$toast.loading({ forbidClick: true })
      await cartapi.updateCount(
        goods.goods_id,
        goods.goods_num,
        goods.goods_sku_id
      )
      // console.log(goods.goods_num)
      this.$store.dispatch('cart/getTotalAction')
    },
    // 删除购物车的商品
    async deleteSel () {
      await this.$store.dispatch('cart/deleteAction', this.selCartId)
      this.$toast.success('删除成功')
    },
    // 跳转到支付界面
    async goPay () {
      const prod = this.selCartList[0].goods
      // console.log(this.selCartList[0])
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'cart',
          data: {
            title: prod.goods_name,
            image: prod.goods_image,
            count: this.selCartList[0].goods_num,
            price: prod.goods_price_min,
            total: this.selCount,
            totalPrice: this.selPrice,
            info: {
              cartIds: String(this.selCartId)
            }
          }
        }
      })
    }
  },
  async created () {
    // 若是登陆 则获取列表
    if (this.isLogin) {
      this.$store.dispatch('cart/getCartAction')
      this.$store.dispatch('cart/getTotalAction')
      return
    }
    // 登陆校验
    this.$confirm(
      this.$route.fullPath,
      () => {
        this.$router.replace('/home')
      }
    )
    // console.log(this.cartList)
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.cart-box {
  width: 100vw;
  height: 100vh;
}

.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .van-checkbox {
      width: 22px;
    }
    .show img {
      width: 100px;
      height: 100px;
      margin-left: 10px;
    }
    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .tit {
        max-height: 55.2px;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          vertical-align: text-bottom;
          span {
            font-size: 16px;
            line-height: 16px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  vertical-align: middle;
  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    align-items: center;
    .price {
      display: flex;
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay, .delete {
      aspect-ratio: 2.2;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }
}
</style>
