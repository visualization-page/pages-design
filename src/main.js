import Vue from 'vue'
import VueSocketio from 'vue-socket.io'
import App from './App.vue'
import router from './router'
import store from './store'
import Http from 'xm-mui/lib/http'
import './plugins/element.js'

const base = `http://${location.hostname}:7001`
Vue.use(new VueSocketio({
  // debug: true,
  connection: base
}))
Vue.config.productionTip = false
Vue.prototype.$http = new Http({
  baseURL: base,
  uri: {
    getTemplate: '/templates',
    getComponents: '/components',
    getRecords: '/records',
    delRecord: '/delRecord',
    getProjectPages: '/records/pages',
    addProjectPages: '/records/pages/add',
    delProjectPages: '/records/pages/del',
  },
  timeout: 600000
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
