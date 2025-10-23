import request from '@/utils/requests'

export const payapi = {
  pay (data) {
    // console.log(data)
    return request({
      method: 'POST',
      url: '/checkout/submit',
      data: data
    })
  }
}
