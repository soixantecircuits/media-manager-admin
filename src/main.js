import Vue from 'vue'
import App from './components/App'
import router from './lib/router'

const app = new Vue({
  router,
  ...App
}).$mount('#app');
