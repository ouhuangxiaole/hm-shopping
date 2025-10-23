<template>
  <div class="goods-item" @click="$router.push(`/prodetail/${id}`)">
    <div class="left">
      <img :src="image" alt="" />
    </div>
    <div class="right">
      <p class="tit text-ellipsis-2" v-html="name"></p>
      <p class="count">已售{{ count }}件</p>
      <p class="price">
        <span class="new">¥{{ newPrice }}</span>
        <span class="old">¥{{ oldPrice }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    newPrice: {
      type: String,
      required: true
    },
    oldPrice: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.goods-item {
  height: 148px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 127px;
    img {
      display: block;
      width: 100%;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .count {
      color: #999;
      font-size: 12px;
    }
    .price {
      color: #999;
      font-size: 16px;
      .new {
        color: #f03c3c;
        margin-right: 10px;
      }
      .old {
        text-decoration: line-through;
        font-size: 12px;
      }
    }
  }
}
</style>
