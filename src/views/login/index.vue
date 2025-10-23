<template>
  <div class="login">
      <van-nav-bar
        title="登陆"
        left-arrow
        @click-left="$router.back()"
      ></van-nav-bar>

      <div class="container">
        <div class="title">
          <h3>手机号登录</h3>
          <p>未注册的手机号登录后将自动注册</p>
        </div>

        <div class="form">
          <div class="form-item">
            <input
              v-model="phone"
              class="inp"
              maxlength="11"
              placeholder="请输入手机号"
              type="text"
            >
          </div>
          <div class="form-item">
            <input
              v-model="picCode"
              class="inp"
              maxlength="5"
              placeholder="请输入图形验证码"
              type="text"
            >
            <img
              v-if="picUrl"
              :src="picUrl"
              alt="点击重新获取"
              @click="getPicCode()"
            >
          </div>
          <div class="form-item">
            <input
              v-model="code"
              class="inp"
              placeholder="请输入短信验证码"
              type="text"
            >
            <button
              :disabled="curreSec !== totalSec"
              @click="getMsgCode()"
            >
              {{ curreSec === totalSec ? '获取验证码' : curreSec + ' 秒后重试' }}
            </button>
          </div>
        </div>

        <div class="login-btn" @click="submit">登录</div>
      </div>
  </div>
</template>

<script>
import { loginapi } from '@/api/login'

export default {
  name: 'LoginPage',
  data () {
    return {
      phone: '18230712114',
      code: '246810',
      picCode: '1111',
      picKey: '',
      picUrl: '',

      totalSec: 60,
      curreSec: 60
    }
  },
  methods: {
    // 手机号和验证码的校验
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        this.$toast.fail('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast.fail('请输入正确的图形验证码')
        return false
      }
      return true
    },

    // 获取图形验证码
    async getPicCode () {
      const res = await loginapi.getPicCode()
      // console.log(res)
      this.picKey = res.data.key
      this.picUrl = res.data.base64
      this.$toast.success('获取成功')
    },

    // 获取验证码
    async getMsgCode () {
      if (!this.validFn()) {
        return
      }
      // 六十秒定时器
      this.timer = setInterval(() => {
        this.curreSec--
        if (this.curreSec < 0) {
          clearInterval(this.timer)
          this.timer = null
          this.curreSec = this.totalSec
        }
      }, 1000)

      // console.log(data)
      await loginapi.getSmsCode(this.picCode, this.picKey, this.phone)
      // console.log(res)
      this.$toast.success('发送成功')
    },

    // 登陆
    async submit () {
      if (!this.validFn()) {
        return
      }
      if (!/^\d{6}$/.test(this.code)) {
        this.$toast.fail('验证码错误')
        return
      }
      this.$toast.loading('登陆中')
      const res = await loginapi.login(this.phone, this.code)
      // console.log(res.data)

      this.$toast.success('登陆成功')
      this.$store.commit('user/setUserInfo', res.data)
      // 判断是否有回跳地址
      const url = this.$route.query.backUrl || '/'
      setTimeout(() => {
        this.$router.replace(url)
      }, 1000)
    }
  },
  async created () {
    this.getPicCode()
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
      text-align: center;
      &:disabled {
        color: gray;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
