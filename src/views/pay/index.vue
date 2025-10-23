<template>
  <div class="pay">
    <van-nav-bar fixed title="订单结算台" left-arrow @click-left="$router.back()" />

    <!-- 地址相关 -->
    <div class="address" @click="showPannel = true">
      <div class="left-icon"><van-icon name="logistics" /></div>
      <div class="info" v-if="currIndex !== -1">
        <div class="info-content">
          <span class="name" v-html="address.name"></span>
          <span class="mobile" v-html="address.phone"></span>
        </div>
        <div class="info-address" v-html="getRegion(address)"></div>
      </div>
      <div class="info" v-else>请选择配送地址</div>
      <div class="right-icon"><van-icon name="arrow" /></div>
    </div>

    <!-- 地址列表 -->
    <van-action-sheet v-model="showPannel">
      <div class="info" @click="addAddress">
        添加新地址
        <van-icon name="add-o" />
      </div>
      <div class="info"
        v-for="address, index in addressList"
        :key="address.address_id"
        @click="chooseAddress(index)"
      >
        <div class="left-icon"><van-icon name="logistics" /></div>
        <div class="info-content">
          <div class="">
            <span class="name" v-html="address.name"></span>
            <span class="mobile" v-html="address.phone"></span>
          </div>
          <div class="info-address" v-html="getRegion(address)"></div>
        </div>
        <div class="right-icon" @click="delAddress($event, address.address_id)"><van-icon name="delete-o" /></div>
      </div>
    </van-action-sheet>

    <!-- 订单明细 -->
    <div class="pay-list">
      <div class="list">
        <div class="goods-item">
            <div class="left">
              <img :src="image" alt="" />
            </div>
            <div class="right">
              <p class="tit text-ellipsis-2" v-text="title"></p>
              <p class="info">
                <span class="count">x{{ count }}</span>
                <span class="price">¥{{ price }}</span>
              </p>
            </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{ total }} 件商品，合计：</span>
        <span class="money">￥{{ totalPrice }}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>订单总金额：</span>
          <span class="red">￥{{ totalPrice }}</span>
        </div>

        <div class="pay-cell">
          <span>优惠券：</span>
          <span>无优惠券可用</span>
        </div>

        <div class="pay-cell">
          <span>配送费用：</span>
          <span v-if="false">请先选择配送地址</span>
          <span v-else class="red">+￥0.00</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span><van-icon name="balance-o" />余额支付（可用 ¥ {{ assets.balance || 0 }} 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="buytips">
        <textarea
          v-model="remark"
          placeholder="选填：买家留言（50字内）"
          cols="30" rows="10"
        ></textarea>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">实付款：<span>￥{{ totalPrice }}</span></div>
      <div class="tipsbtn" @click="checkPay">提交订单</div>
    </div>
  </div>
</template>

<script>
import { addrapi } from '@/api/address'
import { mapGetters, mapState } from 'vuex'
import { payapi } from '@/api/pay'
import { userapi } from '@/api/user'
export default {
  name: 'PayIndex',
  data () {
    return {
      remark: '',
      assets: {},
      showPannel: false,
      currIndex: 0,
      addressList: []
    }
  },
  computed: {
    ...mapState('cart', ['cartTotal']),
    ...mapGetters('cart', ['selCount', 'selPrice']),
    prod () {
      // console.log(this.$store.getters['cart/selCartList'][0])
      return this.$store.getters['cart/selCartList'][0]
    },
    address () {
      return this.currIndex === -1 ? {} : this.addressList[this.currIndex]
    }
  },
  methods: {
    // 获取地址列表
    async getList () {
      const res = await addrapi.getList()
      this.addressList = res.data.list
      if (this.addressList.length === 0) {
        this.currIndex = -1
      }
    },
    // 选择地址列表的地址
    chooseAddress (index) {
      this.currIndex = index
      this.showPannel = false
      // console.log(this.address)
    },
    // 拼接地区字符串
    getRegion (address) {
      const reg = address.region
      return reg.province + ' ' + reg.city + ' ' + reg.region + ' ' + address.detail
    },
    // 添加地址
    async addAddress () {
      const res = await addrapi.add()
      // console.log(res)
      await this.getList()
      this.$toast.success(res.message)
    },
    // 删除地址
    async delAddress (event, addressId) {
      // 阻止点击事件冒泡
      event.stopPropagation()
      // console.log(addressId)
      const res = await addrapi.delete(addressId)
      await this.getList()
      this.$toast.success(res.message)
    },
    // 支付
    async checkPay () {
      if (this.currIndex === -1) {
        this.$toast.fail('请先选择收货地址')
        return
      }
      const info = this.info || {}
      // console.log('支付成功')
      await payapi.pay({
        ...info,
        delivery: 10,
        couponId: 0,
        isUsePoints: 0,
        mode: this.$route.query.mode,
        payType: 10,
        remark: this.remark
      })
      // console.log(res)
      this.$toast.success('支付成功')
      this.$router.back()
    }
  },
  beforeCreate () {
    // console.log(this.$route.query.data)
    // 将data挂载到this上
    Object.assign(this, this.$route.query.data)
    // console.log(this.$route.query.data)
  },
  async created () {
    this.addressList = (await addrapi.getList()).data.list
    this.assets = (await userapi.getAssets()).data.assets
    // console.log(this.addressList)
  }
}
</script>

<style lang="less" scoped>
.van-action-sheet__content {
  padding: 5px 0;
  height: 80vh;
  .info {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #666;
    padding: 20px;
    height: 50px;
    font-size: 12px;
    // margin-bottom: 10px;

    border-bottom: 0.5px solid #666;
    .info-content {
      flex: 1;
    }
    .left-icon {
      margin-right: 20px;
    }
    .van-icon {
      font-size: 16px;
    }
  }
}
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}

.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
    font-size: 16px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}

.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
</style>
