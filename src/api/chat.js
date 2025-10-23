import request from '@/utils/requests'

export const getResponse = (content, stream) => {
  return request({
    method: 'POST',
    url: 'http://127.0.0.1:8000/api/chat',
    data: {
      content,
      isStream: stream
    }
  })
}
