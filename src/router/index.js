import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store/index'

import Layout from '@/views/layout/index'
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

const Login = () => import('@/views/login/index')
const Search = () => import('@/views/search/index')
const ProdList = () => import('@/views/search/list')
const ProdDetail = () => import('@/views/prodetail/index')
const Chat = () => import('@/views/chat/index')
const Pay = () => import('@/views/pay/index')
const MyOrder = () => import('@/views/pay/myorder')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/search', component: Search },
    { path: '/list/:keyword', component: ProdList },
    { path: '/prodetail/:id', component: ProdDetail },
    { path: '/chat', component: Chat },
    { path: '/pay', component: Pay },
    { path: '/myorder', component: MyOrder },
    {
      path: '/',
      redirect: '/home',
      component: Layout,
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    }
  ]
})

// 未登录不可访问的页面
const authUrls = ['/cart', '/pay', '/myother']

// 全局链接守卫
router.beforeEach((to, from, next) => {
  if (!authUrls.includes(to)) {
    next()
    return
  }
  const token = Store.state.user.userInfo.token
  if (!token) {
    next('/login')
  } else {
    next()
  }
})

export default router
