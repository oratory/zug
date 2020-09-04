import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
  const routes = [
  {
    path: '/',
    component: () => import('../views/Main.vue')
  },
  {
    path: '/:wcl',
    component: () => import('../views/Main.vue'),
    props: (route) => { return {wcl: route.params.wcl} }
  },
  {
    path: '/:wcl/:encounter',
    component: () => import('../views/Main.vue'),
    props: (route) => { return {wcl: route.params.wcl, encounter: parseInt(route.params.encounter)} }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
