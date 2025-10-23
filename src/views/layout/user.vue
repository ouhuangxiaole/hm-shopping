<template>
  <div class="user">
    <van-nav-bar title="用户中心"  left-arrow @click-left="$router.back()" />

    <div class="head-page" v-if="isLogin">
      <div class="head-img">
        <img src="@/assets/default-avatar.png" alt="" />
      </div>
      <div class="info">
        <div class="mobile">{{ detail.mobile }}</div>
        <div class="vip">
          <van-icon name="diamond-o" />
          普通会员
        </div>
      </div>
    </div>

    <!-- 未登录 -->
    <div v-else class="head-page" @click="goLogin">
      <div class="head-img">
        <img src="@/assets/default-avatar.png" alt="" />
      </div>
      <div class="info">
        <div class="mobile">未登录</div>
        <div class="words">点击登录账号</div>
      </div>
    </div>

    <div class="my-asset">
      <div class="asset-left">
        <div class="asset-left-item">
          <span>{{ assets.balance || 0 }}</span>
          <span>账户余额</span>
        </div>
        <div class="asset-left-item">
          <span>{{ assets.points || 0 }}</span>
          <span>积分</span>
        </div>
        <div class="asset-left-item">
          <span>{{ assets.coupon || 0 }}</span>
          <span>优惠券</span>
        </div>
      </div>
      <div class="asset-right">
        <div class="asset-right-item">
          <van-icon name="balance-pay" />
          <span>我的钱包</span>
        </div>
      </div>
    </div>
    <div class="order-navbar">
      <div class="order-navbar-item" @click="goOrder('all')">
        <div class="tip" :class="{ 'tip-active': total }">{{ total }}</div>
        <van-icon name="balance-list-o" />
        <span>全部订单</span>
      </div>
      <div class="order-navbar-item" @click="goOrder('payment')">
        <div class="tip" :class="{ 'tip-active': counts.payment }">{{ counts.payment }}</div>
        <van-icon name="clock-o" />
        <span>待支付</span>
      </div>
      <div class="order-navbar-item" @click="goOrder('delivery')">
        <div class="tip" :class="{ 'tip-active': counts.delivery }">{{ counts.delivery }}</div>
        <van-icon name="logistics" />
        <span>待发货</span>
      </div>
      <div class="order-navbar-item" @click="goOrder('received')">
        <div class="tip" :class="{ 'tip-active': counts.received }">{{ counts.received }}</div>
        <van-icon name="send-gift-o" />
        <span>待收货</span>
      </div>
    </div>

    <div class="service">
      <div class="title">我的服务</div>
      <div class="content">
        <div class="content-item">
          <van-icon name="free-postage" />
          <span>收货地址</span>
        </div>
        <div class="content-item">
          <van-icon name="gift-o" />
          <span>领券中心</span>
        </div>
        <div class="content-item">
          <van-icon name="gift-card-o" />
          <span>优惠券</span>
        </div>
        <div class="content-item">
          <van-icon name="question-o" />
          <span>我的帮助</span>
        </div>
        <div class="content-item">
          <van-icon name="balance-o" />
          <span>我的积分</span>
        </div>
        <div class="content-item">
          <van-icon name="refund-o" />
          <span>退换/售后</span>
        </div>
      </div>
    </div>

    <div class="logout-btn"
      v-if="isLogin"
      @click="unlogin"
    >
      <button>退出登录</button>
    </div>
  </div>
</template>

<script>
import { orderapi } from '@/api/order'
import { userapi } from '@/api/user.js'
export default {
  name: 'UserPage',
  data () {
    return {
      detail: {},
      assets: {},
      counts: {}
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.user.userInfo.token
    },
    total () {
      return Object.values(this.counts).reduce((acc, val) => acc + val, 0)
    }
  },
  methods: {
    async getUserInfoDetail () {
      // 获取用户信息
      const { data: { userInfo } } = await userapi.getInfo()
      this.detail = userInfo
      // console.log(this.detail)

      // 获取用户资产
      this.assets = (await userapi.getAssets()).data.assets
      // console.log(this.assets)

      // 获取用户订单数量
      this.counts = (await orderapi.getCounts()).data.counts
      // console.log(this.counts)
    },
    goOrder (type) {
      if (this.isLogin) {
        this.$router.push(`/myorder?dataType=${type}`)
      } else {
        this.$confirm(
          this.$route.fullPath,
          () => {}
        )
      }
    },
    goLogin () {
      // console.log(this.$route.fullPath)
      this.$router.push({
        path: '/login',
        query: {
          backUrl: this.$route.fullPath
        }
      })
    },
    unlogin () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确认要退出登录吗',
        confirmButtonText: '确认',
        cancelButtonText: '点错了'
      }).then(() => {
        // console.log('确认')
        // 删除用户数据
        this.$store.commit('user/removeUserInfo')
        this.$toast.success('退出成功')
        this.detail = {}
      })
    }
  },
  created () {
    if (this.isLogin) {
      this.getUserInfoDetail()
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  min-height: 100vh;
  background-color: #f7f7f7;
  padding-bottom: 50px;
}

.head-page {
  height: 130px;
  background: url("http://cba.itlike.com/public/mweb/static/background/user-header2.png");
  background-size: cover;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  padding-left: 20px;
  .head-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    .mobile {
      margin-bottom: 5px;
      color: #c59a46;
      font-size: 18px;
      font-weight: bold;
    }
    .vip {
      display: inline-block;
      background-color: #3c3c3c;
      padding: 3px 5px;
      border-radius: 5px;
      color: #e0d3b6;
      font-size: 14px;
      .van-icon {
        font-weight: bold;
        color: #ffb632;
      }
    }
  }
}

.my-asset {
  display: flex;
  margin: 10px;
  padding: 10px 0;
  font-size: 12px;
  background-color: #fff;
  .asset-left {
    display: flex;
    justify-content: space-evenly;
    flex: 3;
    .asset-left-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span:first-child {
        font-size: 14px;
        margin-bottom: 5px;
        color: #ff0000;
      }
    }
  }
  .asset-right {
    flex: 1;
    .asset-right-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .van-icon {
        font-size: 20px;
        margin-bottom: 5px;
      }
    }
  }
}

.order-navbar {
  display: flex;
  padding: 15px 0;
  margin: 10px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 5px;
  .order-navbar-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 25%;
    font-size: 12px;
    position: relative;
    .van-icon {
      font-size: 20px;
      margin-bottom: 5px;
    }
    .tip {
      z-index: 999;
      width: 14px;
      height: 14px;
      font-size: 12px;
      font-weight: 700;
      line-height: 14px;
      text-align: center;
      color: white;
      color: transparent;
      background-color: transparent;

      border-radius: 50%;
      position: absolute;
      left: 53%;
      top: -8%;
    }
    .tip-active {
      color: white;
      background-color: red;
    }
  }
}

.service {
  font-size: 14px;
  background-color: #fff;
  border-radius: 5px;
  margin: 10px;
  .title {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    font-size: 16px;
  }
  .content {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    font-size: 14px;
    background-color: #fff;
    border-radius: 5px;
    .content-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 25%;
      margin-bottom: 20px;
      .van-icon {
        font-size: 22px;
        margin-bottom: 5px;
        color: #ff3800;
      }
      span {
        font-size: 12px;
      }
    }
  }
}

.logout-btn {
  button {
    width: 60%;
    margin: 10px auto;
    display: block;
    font-size: 13px;
    color: #616161;
    border-radius: 9px;
    border: 1px solid #dcdcdc;
    padding: 7px 0;
    text-align: center;
    background-color: #fafafa;
  }
}
</style>
