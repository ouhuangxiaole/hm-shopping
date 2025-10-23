import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/vant-ui'
import '@/styles/common.less'
import { confirm } from './utils/confirm'

Vue.config.productionTip = false
Vue.prototype.$confirm = confirm

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
