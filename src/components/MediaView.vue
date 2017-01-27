<template>
  <md-card>
    <md-card-area>
      <md-card-media>
        <img :src="`${moderatorURL}/${mediaID}`" alt="Media">
      </md-card-media>

      <md-card-header>
        <div class="md-title">{{ mediaName }}</div>
        <div class="md-subhead">Uploaded at {{ mediaState }}</div>
      </md-card-header>

      <md-card-content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio itaque ea, nostrum odio. Dolores, sed accusantium quasi non,
        voluptas eius illo quas, saepe voluptate pariatur in deleniti minus sint. Excepturi.
      </md-card-content>
    </md-card-area>

    <md-card-actions>
      <md-button>Action</md-button>
      <md-button>Action</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>

  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import config from '../../settings/default.json'
  import moderatorapi from '../lib/mediamoderatorAPI'

  let data = {
    mediaID: '',
    mediaName: '',
    mediaState: '',
    mediaUploadedAt: undefined,
    mediaInfos: {}
  }

  export default {
    data() {
      return data
    },

    created () {
      this.mediaID = this.$route.params.id
      getMediaInfos(this.mediaID)
    },

    computed: {
      moderatorURL() {
        return `http://${config.moderatorServer}${config.apiRoute}`
      }
    },

    methods: {
      getMediaInfos () {
        let instance = this
        moderatorapi.getMediaDetails(this.mediaID)
        .then((res) => {
          instance.mediaName = res.filename
          instance.mediaState = res.state
          instance.mediaUploadedAt = res.uploadedAt
          instance.mediaInfos = res
        })
        .catch((err) => {
          console.log(err)
        })
      }
    }
  }

</script>

<style>
</style>