import { localUserInfo } from '@/utils/storages'

export default {
  namespaced: true,
  state () {
    return {
      userInfo: localUserInfo.getCache()
    }
  },
  mutations: {
    setUserInfo (state, info) {
      state.userInfo = info
      localUserInfo.setCache(info)
    },
    removeUserInfo (state) {
      state.userInfo = { token: '', userId: '' }
      localUserInfo.removeCache()
    }
  },
  actions: {},
  getters: {}
}
