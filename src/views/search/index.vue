<template>
  <div class="search">
    <van-nav-bar
      title="商品搜索"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-search
      autofocus
      v-model="keyword"
      shape="round"
      left-icon=""
      right-icon="search"
      placeholder="搜索商品"
      @search="goSearch(keyword)"
    />

    <!-- 搜索历史 -->
    <div class="search-history" v-if="history.length !== 0">
      <div class="title">
        <span>最近搜索</span>
        <van-icon name="delete-o" size="16" @click="clearHist"/>
      </div>
      <div class="list">
        <div
          class="list-item"
          v-for="item, index in history"
          :key="index"
          v-html="item"
          @click="goSearch(item)">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { localHistInfo } from '@/utils/storages'

export default {
  name: 'SearchIndex',
  data () {
    return {
      keyword: '',
      history: []
    }
  },
  methods: {
    clearHist () {
      // 清空历史搜索以及缓存
      this.history = []
      localHistInfo.removeCache()
    },
    goSearch (keyword) {
      if (keyword === '') {
        return
      }
      // console.log(keyword)
      const index = this.history.indexOf(keyword)
      if (index !== -1) {
        this.history.splice(index, 1)
      }
      // 清空搜索栏
      this.keyword = ''
      // 在首部添加历史记录 以及缓存
      this.history.unshift(keyword)
      localHistInfo.setCache(this.history)
      // 跳转到搜索列表页
      this.$router.push(`/list/${keyword}`)
    }
  },
  created () {
    // 获取历史搜索缓存
    this.history = localHistInfo.getCache()
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    background-color: #fa2209;
    color: #fff;
  }
  ::v-deep .van-search__action {
    background-color: #c21401;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 5px 5px 0;
    margin-right: 10px;
  }
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
  }
  .list-item {
    width: 30%;
    text-align: center;
    padding: 7px;
    line-height: 15px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    border: 1px solid #efefef;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
}
</style>
