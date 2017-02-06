<template>
  <div>

    <md-toolbar class="md-transparent">
      <md-button class="md-primary" @click="goBackToList()" style="position: absolute;">Back to list</md-button>
    </md-toolbar>

    <md-layout md-gutter md-row style="background-color: ghostwhite;">
      <md-layout md-flex>
        <md-card md-with-hover style="margin-left: auto;">
          <md-card-media>
            <md-image :md-src="`${moderatorURL}/${mediaId}`" alt="Media"></md-image>
          </md-card-media>
        </md-card>
      </md-layout>

      <md-layout md-gutter="40" md-column>
        <div style="margin-left: 15%; margin-right: 15%;">
          <md-layout>
            <div style="margin-left: auto; margin-right: auto;"><h2 class="md-title">{{ mediaName }}</h2></div>
          </md-layout>
          <md-layout>
            <md-select v-model="currentMediaState" @change="updateState(currentMediaState)">
              <md-option v-for="state in states" :value="state">{{ state }}</md-option>
            </md-select>
          </md-layout>
          <md-layout>
            <div class="md-subhead">Uploaded at {{ mediaUploadedAt }}</div>
          </md-layout>
          <md-layout>
            <div>ID: {{ mediaId }}</div>
          </md-layout>
        </div>
      </md-layout>
    </md-layout>

  </div>
</template>

<script>

  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import config from '../../settings/default.json'
  import moderatorapi from '../lib/mediamoderatorAPI'

  let data = {
    currentMediaState: '',
  }

  export default {
    data() {
      return data
    },

    created() {
    },

    mounted() {
      let instance = this
      this.$store.commit('setCurrentMediaId', this.$route.params.id)

      this.getServerConfig()
        .then((res) => {
          instance.$store.commit('setStates', res.states)
          this.getMediaDetails()
          this.getMediaMetas()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    computed: {
      moderatorURL() {
        return `http://${config.moderatorServer}${config.apiRoute}`
      },
      currentPage() {
        return this.$store.state.currentPage
      },
      states() {
        return this.$store.state.states
      },
      mediaId() {
        return this.$store.state.currentMediaId
      },
      mediaName() {
        return this.$store.state.currentMediaName
      },
      mediaState() {
        return this.$store.state.currentMediaState
      },
      mediaUploadedAt() {
        return this.$store.state.currentMediaUploadedAt
      },
      mediaInfos() {
        return this.$store.state.currentMediaInfos
      }
    },

    methods: {
      getServerConfig() {
        let instance = this
        return new Promise((resolve, reject) => {
          moderatorapi.getConfig()
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },

      getMediaDetails() {
        let instance = this
        moderatorapi.getMediaDetails(this.mediaId)
          .then((res) => {
            instance.$store.commit('setCurrentMediaName', res.filename)
            instance.$store.commit('setCurrentMediaState', res.state)
            instance.currentMediaState = res.state
            let timestamp = new Date(res.uploadedAt)
            instance.$store.commit('setCurrentMediaUploadedAt', timestamp.toLocaleString())
            instance.$store.commit('setCurrentMediaInfos', res)
          })
          .catch((err) => {
            console.log(err)
          })
      },

      getMediaMetas() {
        let instance = this
        moderatorapi.getMediaMetas(this.mediaId)
          .then((res) => {
            console.log(res)
            instance.$store.commit('setCurrentMediaMetas', res)
          })
          .catch((err) => {
            console.log(err)
          })
      },

      updateState(state) {
        let instance = this
        moderatorapi.updateState(this.mediaId, state)
          .then((res) => {
            this.$store.commit('setCurrentMediaState', state)
            this.getFilesList(this.$store.state.currentPage, this.$store.state.nbFilesToDisplay, this.$store.state.stateToSearch)
          })
          .catch((err) => {
            console.log(err)
          })
      },

      getFilesList(page, per_page, state, callback) {
        let instance = this
        moderatorapi.getFilesList(page, per_page, state)
          .then((res) => {

            res.data.forEach((media) => {
              let timestamp = new Date(media.uploadedAt)
              media.uploadedAt = timestamp.toLocaleString()
            })

            instance.$store.commit('setFiles', res.data)
            instance.updateFilesCount()

            if (callback && typeof callback === 'function') {
              callback(res)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },

      updateFilesCount() {
        let instance = this
        moderatorapi.getFilesCount()
          .then((res) => {
            instance.$store.commit('setFilesCount', res)
            if (instance.currentPage > instance.nbPages) {
              instance.$store.commit('setCurrentPage', instance.nbPages)
            } else if (instance.currentPage < 1) {
              instance.$store.commit('setCurrentPage', 1)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },

      goBackToList() {
        this.$router.push(`/medias/list/${this.currentPage}`)
      }
    }
  }

</script>

<style>
</style>