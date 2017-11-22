import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from './components/App'
import router from './lib/router'
import store from './vuex/store'

const { SpacebroClient } = require('spacebro-client')

const client = new SpacebroClient({
  host: 'spacebro.space',
  port: 3333,
  channelName: 'media-stream',
  client: {
    name: 'foo',
    description: 'a foo tool',
    in: {
      inFoo: {
        eventName: 'inFoo',
        description: 'Input foo',
        type: 'all'
      }
    },
    out: {
      outBar: {
        eventName: 'outBar',
        description: 'Output bar',
        type: 'all'
      }
    }
  }
})

client.on('inFoo', (data) => console.log('inFoo', data))

Vue.use(VueMaterial)


const app = new Vue({
  router,
  store,
  ...App
}).$mount('#app');
