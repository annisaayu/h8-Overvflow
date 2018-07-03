import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import Askpage from './views/Askpage.vue'
import Questionpage from './views/Questionpage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/askpage',
      name: 'askpage',
      component: Askpage
    },
    {
      path: '/questionpage',
      name: 'questionpage',
      component: Questionpage
    }
  ]
})
