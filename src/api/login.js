import request from '@/utils/requests'

export const loginapi = {
// 获取图片验证码
  getPicCode () {
    return request.get('/captcha/image')
  },
  // 获取短信验证码
  getSmsCode (captchaCode, captchaKey, mobile) {
    return request({
      method: 'post',
      url: '/captcha/sendSmsCaptcha',
      form: {
        captchaCode,
        captchaKey,
        mobile
      }
    })
  },
  // 登陆
  login (mobile, msgCode) {
    // console.log(mobile, msgCode)
    return request.post('/passport/login', {
      form: {
        isParty: false,
        mobile,
        partyData: {},
        smsCode: msgCode
      }
    })
  }
}
