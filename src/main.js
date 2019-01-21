import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import App from './App.vue'
import router from './router'
import store from './store'
import Http from 'xm-mui/lib/http'

Vue.use(new VueSocketio({
  // debug: true,
  connection: 'http://127.0.0.1:7001/'
}))
Vue.config.productionTip = false
Vue.prototype.$http = new Http({
  baseURL: 'http://127.0.0.1:7001',
  uri: {
    initCookie: '/',
    getTemplate: '/templates',
    prepareTemplate: '/prepareTemplate'
  },
  timeout: 600000
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')