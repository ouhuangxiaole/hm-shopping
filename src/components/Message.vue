<template>
  <div class="message">
    <div class="index my-message" v-if="send === 0">
      <img
        class="message-image"
        v-if="type"
        :src="send_image"
      />
      <div class="message-text" v-else v-html="text"></div>
      <div class="user-image">
        <div class="arrow" v-if="type === 0"></div>
        <img :src="user_image" alt="图片加载失败" />
      </div>
    </div>
    <div class="index your-message" v-else>
      <div class="user-image">
        <div class="arrow" v-if="!type"></div>
        <img :src="user_image" alt="图片加载失败" />
      </div>
      <img
        class="message-image"
        v-if="type"
        :src="send_image"
      />
      <div class="message-text" v-else v-html="text"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageBox',
  props: {
    send: {
      type: Number,
      required: true
    },
    type: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: false
    },
    user_image: {
      type: String,
      required: true
    },
    send_image: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="less" scoped>
@size: 40px;
// 公共样式
.message {
  width: 100%;
  .index {
    display: flex;
    .user-image {
      width: @size;
      height: @size;
      position: relative;
      img {
        width: inherit;
        height: inherit;
        border-radius: 5px;
      }
      .arrow {
        position: absolute;
        width: 0.177 * @size;
        height: 0.177 * @size;
        top: 50%;
        transform-origin: 50% 50%;
      }
    }
    .message-text,
    .message-image {
      margin: 0 10px;
    }
    .message-text {
      // line-height: 45px;
      padding: 0.3 * @size 0.25 * @size;
      font-size: 0.31 * @size;
      border-radius: 8px;
      max-width: 235px;
      display: block;
      transform: 50% 50%;
    }
    .message-image {
      width: 180px;
    }
  }
}

.my-message {
  display: flex;
  .user-image {
    .arrow {
      background-color: rgb(146, 236, 104);
      transform: translate(-14px, -50%) rotate(45deg);
    }
  }
  .message-text {
    background-color: rgb(146, 236, 104);
  }
}

.your-message {
  display: flex;
  width: 100%;
  .user-image {
    .arrow {
      right: 92%;
      background-color: white;
      transform: translate(50px, -50%) rotate(45deg);
    }
  }
  .message-text {
    background-color: white;
  }
}
</style>
