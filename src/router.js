import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Demo = r => require.ensure([], () => r(require('@/components/demo')))

export default new Router({
  routes: [
    {
      path: '/',
      hidden: true,
      redirect(to) {
        return 'demo'
      }
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo
    }
  ]
})
