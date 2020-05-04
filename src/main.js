import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@babel/polyfill'

Vue.config.productionTip = false

import iView from 'iview'
Vue.use(iView)

import {post,get,patch,put,del} from '@/util/request'
import axios from 'axios'
Vue.prototype.$post=post
Vue.prototype.$get=get
Vue.prototype.$patch=patch
Vue.prototype.$put=put
Vue.prototype.$del=del
Vue.config.productionTip = false
window.$http = axios

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
