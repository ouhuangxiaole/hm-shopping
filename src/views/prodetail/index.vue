<template>
  <div class="prodetail">
    <!-- 头部 -->
    <van-nav-bar
      fixed
      title="商品详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 轮播图 -->
    <van-swipe :autoplay="3000" @change="onChange">
      <van-swipe-item
        v-for="image in images"
        :key="image.file_id"
      >
        <img
          :src="image.external_url"
          :title="image.file_name"
          :alt="image.file_name"
        />
      </van-swipe-item>

      <!-- 轮播图右下角角标 -->
      <template #indicator>
        <div class="custom-indicator">
          {{ currIndex + 1 }} / {{ images.length }}
        </div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ detail.goods_price_min }}</span>
          <span class="oldprice">￥{{ detail.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ detail.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2" v-html="detail.goods_name"></div>

      <div class="service">
        <div class="left-words">
          <span
            v-for="sve in service"
            :key="sve.service_id"
            :title="sve.summary"
          >
            <van-icon name="passed" />
            {{ sve.name }}
          </span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">
          商品评价 ({{ comment.total }}条)
        </div>
        <div class="right">
          查看更多
          <van-icon name="arrow" />
        </div>
      </div>
      <!-- 评论列表 -->
      <div class="comment-list">
        <div class="comment-item"
          v-for="cmt in comment.list"
          :key="cmt.comment_id"
        >
          <div class="top">
            <img :src="cmt.user.avatar_url">
            <div class="name" v-html="cmt.user.nick_name"></div>
            <!-- 评分 -->
            <van-rate
              :size="16"
              :value="Math.floor(Math.random() * 5)"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
            />
          </div>
          <div class="content" v-html="cmt.content"></div>
          <div class="time" v-html="cmt.create_time"></div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc">
      <img src="https://uimgproxy.suning.cn/uimg1/sop/commodity/kHgx21fZMWwqirkMhawkAw.jpg" alt="">
      <img src="https://uimgproxy.suning.cn/uimg1/sop/commodity/0rRMmncfF0kGjuK5cvLolg.jpg" alt="">
      <img src="https://uimgproxy.suning.cn/uimg1/sop/commodity/2P04A4Jn0HKxbKYSHc17kw.jpg" alt="">
      <img src="https://uimgproxy.suning.cn/uimg1/sop/commodity/MT4k-mPd0veQXWPPO5yTIw.jpg" alt="">
    </div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home" @click="$router.push('/')">
        <van-icon name="wap-home-o" />
        <span>首页</span>
      </div>
      <div class="icon-cart">
        <span
          class="num"
          v-if="cartTotal"
          v-html="cartTotal"
        ></span>
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <div class="btn-add" @click="pannel('cart')">加入购物车</div>
      <div class="btn-buy" @click="pannel('buy')">立刻购买</div>
    </div>

    <!-- 弹窗 -->
    <van-action-sheet
      v-model="showPannel"
      :title="mode === 'cart' ? '加入购物车' : '立刻购买'"
    >
      <div class="product">
        <div class="product-title">
          <div class="left">
            <img :src="detail.goods_image" alt="">
          </div>
          <div class="right">
            <div class="price">
              <span>¥</span>
              <span class="nowprice" v-html="detail.goods_price_min "></span>
            </div>
            <div class="count">
              <span>库存</span>
              <span v-html="detail.stock_total"></span>
            </div>
          </div>
        </div>
          <div class="num-box">
            <span>数量</span>
            <van-stepper v-model="count" :disabled="0 === detail.stock_total" />
          </div>
          <div class="showbtn" v-if="detail.stock_total">
            <div
              class="btn"
              v-if="mode === 'cart'"
              @click="loginAuthOptions"
            >加入购物车</div>
            <div
              class="btn now"
              v-else
              @click="loginAuthOptions"
            >立刻购买</div>
          </div>
          <div class="btn-none" v-else>该商品已抢完</div>
        </div>
    </van-action-sheet>
  </div>

</template>

<script>
import { prodapi } from '@/api/product'
import { cartapi } from '@/api/cart'
export default {
  name: 'ProDetail',
  data () {
    return {
      detail: {},
      images: [],
      comment: [],
      service: [],
      // 当前轮播图下标
      currIndex: 0,
      // 点击的类型
      mode: 'cart',
      // 是否弹窗
      showPannel: false,
      // 购买或者添加购物车的数量
      count: 1,
      cartTotal: 0
    }
  },
  computed: {
    totalPrice () {
      return this.count * this.detail.goods_price_min
    }
  },
  methods: {
    onChange (index) {
      this.currIndex = index
    },
    // 购买/加入购物车弹窗
    pannel (mode) {
      // console.log('addFunc')
      this.mode = mode
      this.showPannel = true
    },
    // 添加购物车
    async addCart () {
      const res = await cartapi.addCart(
        this.goodsId,
        this.count,
        this.detail.skuList[0].goods_sku_id
      )
      // console.log(res.data)
      // 关闭弹窗 显示数据 给提示
      this.$toast.success('添加成功')
      this.showPannel = false
      this.cartTotal = res.data.cartTotal
    },
    // 立刻购买
    goBuyNow () {
      // console.log(this.detail)
      this.$router.push({
        path: '/pay',
        query: {
          mode: 'buyNow',
          data: {
            title: this.detail.goods_name,
            image: this.detail.goods_image,
            count: this.count,
            price: this.detail.goods_price_min,
            total: this.count,
            totalPrice: this.totalPrice,
            info: {
              goodsId: String(this.detail.goods_id),
              goodsNum: this.count,
              goodsSkuId: this.detail.skuList[0].goods_sku_id
            }
          }
        }
      })
    },
    // 需要登陆才能进行的行为
    async loginAuthOptions () {
      const token = this.$store.state.user.userInfo.token
      // console.log(token)
      // 一般此时需要后端判断token是否过期
      if (!token) {
        this.$confirm(
          this.$route.fullPath,
          () => {
            this.showPannel = false
          }
        )
        return
      }
      // console.log('进行加入购物车操作')
      if (this.mode === 'cart') {
        this.addCart()
      } else {
        this.goBuyNow()
      }
    }
  },
  async created () {
    // 获取商品ID
    this.goodsId = this.$route.params.id
    // 获取商品详细信息
    const det = await prodapi.getDetail(this.goodsId)
    this.detail = det.data.detail
    this.images = det.data.detail.goods_images
    // 获取商品评论
    const cmt = await prodapi.getComment(this.goodsId)
    this.comment = cmt.data
    // 获取购物车总数
    this.cartTotal = (await cartapi.getTotal()).data.cartTotal
    // 获取商品服务
    this.service = (await prodapi.getService(this.goodsId)).data.list
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100%!important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .content {
      max-width: 100vw;
    }
    .time {
      color: #999;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-cart {
      position: relative;
      padding: 0 6px;
      .num {
        z-index: 999;
        position: absolute;
        top: -2px;
        right: 0;
        min-width: 16px;
        // min-height: 16px;
        // padding: 0 4px;
        color: #fff;
        text-align: center;
        background-color: #ee0a24;
        border-radius: 50%;
      }
    }
    .icon-home, .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
      span {
        font-size: 10px;
      }
    }
    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}

.tips {
  padding: 10px;
}

.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn, .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}
</style>
