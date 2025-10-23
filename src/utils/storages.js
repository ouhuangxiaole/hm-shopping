const USER_KEY = 'hm-shop-user-info'
const HIST_KEY = 'hm-shop-search-history'

// 用于操作本地用户信息
export const localUserInfo = {
  getCache: () => {
    const info = localStorage.getItem(USER_KEY)
    return info ? JSON.parse(info) : { token: '', userId: '' }
  },
  setCache: (data) => {
    localStorage.setItem(USER_KEY, JSON.stringify(data))
  },
  removeCache: () => {
    localStorage.removeItem(USER_KEY)
  }
}

// 用于操作本地搜索历史
export const localHistInfo = {
  getCache: () => {
    const info = localStorage.getItem(HIST_KEY)
    return info ? JSON.parse(info) : []
  },
  setCache: (data) => {
    localStorage.setItem(HIST_KEY, JSON.stringify(data))
  },
  removeCache: () => {
    localStorage.removeItem(HIST_KEY)
  }
}
