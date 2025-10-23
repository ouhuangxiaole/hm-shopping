import request from '@/utils/requests'

export const addrapi = {
  // 获取地址列表
  getList () {
    return request.get('/address/list')
  },
  // 添加地址
  add () {
    return request.post('/address/add', {
      form: {
        name: '杨天乐',
        phone: '18230712114',
        region: [
          { value: '782', label: '上海' },
          { value: '783', label: '上海市' },
          { value: '785', label: '徐汇区' }
        ],
        detail: '贵州师范大学一栋'
      }
    })
  },
  // 删除地址
  delete (addressId) {
    return request.post('/address/remove', {
      addressId
    })
  }
}
