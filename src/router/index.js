import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Select from "../views/Select";
import store from "../store/index"

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/select',
    name: 'Select',
    component: Select
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.state.isAuthenticated) next({ name: 'Login' });
  else next()
})

export default router
