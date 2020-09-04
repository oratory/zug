import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-dark.css'
Vue.use(VueMaterial)

window.config = require('../../config.json')
if (process.env.NODE_ENV === 'development') {
  window.baseURL = window.config.backend.devServer
}
else {
  window.baseURL = window.config.backend.prodServer
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
