import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
  const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('../views/Main.vue')
  },
  {
    name: 'Report',
    path: '/:wcl',
    component: () => import('../views/Main.vue'),
    props: (route) => { return {wcl: route.params.wcl} }
  },
  {
    name: 'Encounter',
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
