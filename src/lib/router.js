import Vue from 'vue'
import Router from 'vue-router'
import Root from '../Root'
import Media from '../Media'
import NotFound from '../components/NotFound'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Root
    },
    {
      path: '/medias/list/:page',
      component: Root
    },
    {
      path: '/medias/details/:id',
      component: Media
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
