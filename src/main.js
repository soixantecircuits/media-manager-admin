import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from './components/App'
import router from './lib/router'
import store from './vuex/store'
import VueSweetAlert from 'vue-sweetalert'

const settings = SETTINGS

const { SpacebroClient } = require('spacebro-client')
const client = new SpacebroClient(settings.service.spacebro)

Vue.prototype.$spacebro = client
Vue.use(VueMaterial)
Vue.use(VueSweetAlert)

new Vue({
  router,
  store,
  ...App
}).$mount('#app')
