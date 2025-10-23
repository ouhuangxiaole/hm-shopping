<template>
  <div class="home">
    <!-- 导航条 -->
    <van-nav-bar title="智慧商城" fixed />

    <!-- 搜索框 -->
    <van-search
      readonly
      shape="round"
      background="#f1f1f2"
      :placeholder="placeholder"
      @click="$router.push('/search')"
    />

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="image, index in banList" :key="index">
        <img :src="image.imgUrl" :alt="image.imgName" />
      </van-swipe-item>
    </van-swipe>

    <!-- 导航 -->
    <van-grid column-num="5" icon-size="40">
      <van-grid-item
        v-for="(item, index) in navList"
        :key="index"
        :icon="item.imgUrl"
        :text="item.text"
        @click="$router.push('/category')"
      />
    </van-grid>

    <!-- 主会场 -->
    <div class="main">
      <img :src="main.imgUrl" :title="main.imgName" />
    </div>

    <!-- 猜你喜欢 -->
    <div class="guess">
      <p class="guess-title">-- 猜你喜欢 --</p>
      <div class="goods-list">
        <GoodsItem
          v-for="prod in proList"
          :id="prod.goods_id"
          :key="prod.goods_id"
          :name="prod.goods_name"
          :image="prod.goods_image"
          :count="prod.goods_sales"
          :newPrice="prod.goods_price_min"
          :oldPrice="prod.goods_price_max"
        ></GoodsItem>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getHomeData } from '@/api/home'

export default {
  name: 'HomePage',
  components: {
    GoodsItem
  },
  data () {
    return {
      main: '',
      placeholder: '',
      // richText: '',
      navList: [],
      banList: [],
      proList: []
    }
  },
  methods: {},
  async created () {
    const res = (await getHomeData()).data.pageData.items
    // 轮播图 导航 商品列表
    this.banList = res[1].data
    this.navList = res[3].data
    this.proList = res[6].data
    // 主会场 搜索框文本
    this.main = res[4].data[0]
    this.placeholder = res[0].params.placeholder
    // this.richText = res[5].params.content
    // console.log(this.proList)
  }
}
</script>

<style lang="less" scoped>
.home {
  padding-top: 100px;
  padding-bottom: 50px;
}

// 导航条样式定制
.van-nav-bar {
  z-index: 999;
  background-color: #1989FA;
  ::v-deep .van-nav-bar__title {
    color: #fff;
  }
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}

// 分类导航部分
.my-swipe .van-swipe-item {
  height: 185px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  background-color: #39a9ed;
}

.my-swipe .van-swipe-item img {
  width: 100%;
  height: 185px;
}

// 主会场
.main img {
  display: block;
  width: 100%;
}

// 猜你喜欢
.guess .guess-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
