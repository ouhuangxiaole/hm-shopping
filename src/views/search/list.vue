<template>
  <div class="search">
    <van-nav-bar
      fixed
      title="商品列表"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-search
      readonly
      shape="round"
      background="#ffffff"
      :value="keyword"
      show-action
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
    <div class="sort-btns">
      <div
        class="sort-item"
        @click="getGoodsList('all')"
      >综合</div>
      <div
        class="sort-item"
        @click="getGoodsList('sales')"
      >销量</div>
      <div
        class="sort-item"
        @click="getGoodsList('price')"
      >价格</div>
    </div>

    <div class="goods-list">
      <GoodsItem
        v-for="prod in goodsList"
        :key="prod.goods_id"
        :id="prod.goods_id"
        :name="prod.goods_name"
        :image="prod.goods_image"
        :count="prod.goods_sales"
        :oldPrice="prod.goods_price_max"
        :newPrice="prod.goods_price_min"
      ></GoodsItem>
    </div>
  </div>
</template>

<script>

import { prodapi } from '@/api/product'
import GoodsItem from '@/components/GoodsItem.vue'

export default {
  name: 'SearchIndex',
  components: {
    GoodsItem
  },
  data () {
    return {
      keyword: this.$route.params.keyword,
      goodsList: []
    }
  },
  methods: {
    async getGoodsList (sortType) {
      const res = await prodapi.getList(this.keyword, sortType)
      // console.log(res)
      this.goodsList = res.data.list.data
    }
  },
  async created () {
    // console.log(this.$route.params.keyword)
    await this.getGoodsList('all')
    // console.log(this.goodsList)
  }
}
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .tool {
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;
    .sort-item {
      text-align: center;
      flex: 1;
      font-size: 16px;
    }
  }
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
