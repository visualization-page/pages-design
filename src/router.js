import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('./views/Create.vue'),
      children: [
        {
          path: ':type/:id/:dirName',
          component: () => import('./views/Create.vue')
        }
        // {
        //   path: 'record/:id/:dirName',
        //   component: () => import('./views/Create.vue'),
        // }
      ]
    }
  ]
})
