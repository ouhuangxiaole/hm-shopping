<template>
  <div class="chat-page">
    <van-nav-bar
      fixed
      title="deepseek-R1"
      left-arrow
      @click-left="$router.back()"
    >
      <template #right>
        <van-icon name="ellipsis" size="18" />
      </template>
    </van-nav-bar>
    <div class="page-content">
      <div class="message-box" ref="messageBox">
        <Message
          v-for="msg, index in messages"
          :key="index"
          :send="msg.code"
          :type="msg.type"
          :text="msg.content"
          :user_image="msg.image"
          :send_image="msg.content"
        ></Message>
      </div>
    </div>
      <InputBox
        v-model="message"
        @send="send"
        @upload="uploadFile"
      ></InputBox>
  </div>
</template>

<script>
import InputBox from '@/components/Input.vue'
import Message from '@/components/Message.vue'
import { getResponse } from '@/api/chat'

export default {
  components: {
    InputBox: InputBox,
    Message: Message
  },
  data () {
    return {
      message: '',
      messages: [
        // code: 0 自己  1 对方
        // type: 0 文字  1 图片
        {
          code: 0,
          type: 0,
          content: '你好',
          image: require('@/assets/ffs/feifeisha_1.png')
        },
        {
          code: 1,
          type: 0,
          content: '你好',
          image: require('@/assets/ffs/feifeisha_2.png')
        },
        {
          code: 0,
          type: 1,
          content: require('@/assets/banner1.jpg'),
          image: require('@/assets/ffs/feifeisha_1.png')
        },
        {
          code: 1,
          type: 1,
          content: require('@/assets/banner2.jpg'),
          image: require('@/assets/ffs/feifeisha_1.png')
        }
      ]
    }
  },
  methods: {
    async send () {
      if (this.message === '') {
        return
      }
      this.messages.push({
        code: 0,
        type: 1,
        content: this.message,
        image: require('@/assets/ffs/feifeisha_1.png')
      })
      const content = this.message
      this.message = ''

      // 发请求
      this.$toast.loading({
        message: '思考中',
        // 禁用背景点击
        forbidClick: true,
        duration: 0
      })
      const res = await getResponse(content, 0)
      this.$toast.clear()
      // console.log(res.message)

      this.messages.push({
        code: 1,
        type: 1,
        content: res.message,
        image: require('@/assets/logo.png')
      })

      this.$refs.messageBox.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    },
    uploadFile () {
      this.$toast.fail('功能开发中')
    }
  },
  created () {
    // 考虑聊天记录持久化
  }
}
</script>

<style lang="less" scoped>
@import url(@/assets/iconfont/iconfont.css);
.chat-page {
  height: 100vh;
  background-color: #EDEDED;
  .page-content {
    margin: 46px 0;
    padding-top: 15px;
    // height: 80.5vh;
    overflow: scroll;
    .message-box {
      min-height: 550px;
      padding: 0 15px;
      background-color: #EDEDED;
      .message {
        display: flex;
        margin-bottom: 10px;
        justify-content: end;
      }
    }
  }
}
.cover {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: white;
  position: fixed;
  .enlarge {
    position: fixed;
    width: 100%;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}
</style>
