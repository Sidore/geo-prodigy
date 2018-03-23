import Vue from 'vue'
import Router from 'vue-router'
import MapC from '@/components/Map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: MapC
    }, 
  ]
})
