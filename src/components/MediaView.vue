<template>
  <div>

    <md-toolbar md-theme="grey">
      <md-button class="md-primary" @click="goBackToList()">Back to list</md-button>
      <div style="flex: 1;"></div>
      <md-button v-if="mediasList.length > 0" :disabled="currentPage === 1 && mediaID === mediasList[0]._id" @click="goToPreviousMedia">Previous</md-button>
      <md-button v-if="mediasList.length > 0" :disabled="currentPage === totalPages && mediaID === mediasList[mediasList.length - 1]._id" @click="goToNextMedia">Next</md-button>
      <div style="flex: 1;"></div>
      <md-button @click="deleteFile(mediaID)">Delete this file</md-button>
    </md-toolbar>

    <md-layout>

    <md-layout md-flex="60" md-flex-offset="20" md-row style="border-radius: 8px;">
      <md-layout md-flex>
        <md-card style="background: black; width: 100%;">
          <md-card-media style="margin: auto;">
            <video v-if="media.type && media.type.search('video') !== -1" :src="media.url" muted autoplay controls></video>
            <md-image v-else :md-src="media.url" alt="Media"></md-image>
          </md-card-media>
        </md-card>
      </md-layout>

      <md-layout md-flex>
        <md-card style="height: 100%;">
          <md-card-area md-inset>
            <md-card-header>
              <h2 class="md-title">{{ media.file }}</h2>
            </md-card-header>
          </md-card-area>

          <md-card-area md-inset>
            <md-input-container style="height: 0; padding: 8px 16px; margin: 0;">
              <label for="state" style="position: relative;"><b>State</b></label>
              <md-select name="state" v-model="media.state" @change="setState(media.state)" md-align-trigger>
                <md-option v-for="state in statesList" :value="state">{{ state }}</md-option>
              </md-select>

              <label for="bucket" style="position: relative;"><b>Bucket</b></label>
              <md-select name="bucket" md-align-trigger>
                <md-option v-for="bucket in bucketsList" :value="bucket.name">{{ bucket.name }}</md-option>
              </md-select>
            </md-input-container>
          </md-card-area>

          <md-card-area md-inset>
            <md-card-content>
              <md-table>
                <md-table-row>
                  <md-table-cell style="text-align: left;"><b>Uploaded at: </b></md-table-cell><md-table-cell style="text-align: left;">{{ media.uploadedAt }}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell style="text-align: left;"><b>ID: </b></md-table-cell><md-table-cell style="text-align: left;">{{ media._id }}</md-table-cell>
                </md-table-row>

                <md-table-row v-if="media.meta" v-for="(value, key) in media.meta">
                  <md-table-cell style="text-align: left;"><b>{{ key }}: </b></md-table-cell><md-table-cell style="text-align: left;">{{ value }}</md-table-cell>
                </md-table-row>
              </md-table>
            </md-card-content>
          </md-card-area>

        </md-card>
      </md-layout>
    </md-layout>

    </md-layout>

  </div>
</template>

<script>

  import Vue from 'vue'
  import { mapGetters } from 'vuex'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import moderatorapi from '../lib/mediamanagerAPI'
  const config = SETTINGS

  let data = {
    currentMediaState: '',
  }

  export default {
    data() {
      return data
    },

    mounted() {
      this.getPageData()
    },

    computed: {
      ...mapGetters({
        media: 'getCurrentMedia',
        mediaID: 'getCurrentMediaID'
      }),
      moderatorURL() {
        return `http://${config.mediaManager.server}:${config.mediaManager.port}${config.mediaManager.apiRoute}`
      },
      bucketsList() {
        return this.$store.state.bucketsList
      },
      statesList() {
        return this.$store.state.statesList
      },
      mediasList () {
        return this.$store.state.mediasList
      },
      currentPage() {
        return this.$store.state.currentPage
      },
      totalMedias() {
        return this.$store.state.totalMedias
      },
      mediasPerPage() {
        return this.$store.state.mediasPerPage
      },
      mediaListPos() {
        let instance = this
        if (this.mediasList.length > 0) {
          return this.mediasList.findIndex((element) => {
            return element._id === instance.mediaID
          })
        } else {
          return -1
        }
      },
      totalPages() {
        return Math.floor(this.totalMedias / this.mediasPerPage) + ((this.totalMedias % this.mediasPerPage) !== 0 ? 1 : 0)
      }
    },

    methods: {
      getPageData() {
        let instance = this
        this.$store.commit('setCurrentMediaID', this.$route.params.id)

        this.getServerConfig()
          .then((res) => {
            instance.$store.commit('setStatesList', res.states)
            this.getBuckets()
            this.getMediaInfos()
          })
          .catch((err) => {
            console.log(err)
          })
      },

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

      getBuckets() {
        const instance = this
        moderatorapi.getBuckets()
        .then(res => {
          instance.$store.commit('setBucketsList', res)
        })
        .catch(err => {
          console.error(err)
        })
      },

      getMediaInfos() {
        let instance = this
        moderatorapi.getMediaInfos(this.mediaID)
          .then((res) => {
            instance.$store.commit('setCurrentMedia', res)
            instance.media.state = res.state
            let timestamp = new Date(res.uploadedAt)
            instance.media.uploadedAt = timestamp.toLocaleString()
          })
          .catch((err) => {
            console.log(err)
          })
      },

      setState(state) {
        let instance = this
        moderatorapi.setState(this.media._id, state)
          .then((res) => {
            this.media.state = state
            this.getMediasList(this.currentPage, this.mediasPerPage, this.stateFilter)
          })
          .catch((err) => {
            console.log(err)
          })
      },

      getMediasList(page, perPage, state, callback) {
        let instance = this
        moderatorapi.getMediasList(page, perPage, state)
          .then((res) => {

            res.data.forEach((media) => {
              let timestamp = new Date(media.uploadedAt)
              media.uploadedAt = timestamp.toLocaleString()
            })

            instance.$store.commit('setMediasList', res.data)
            instance.updateTotalMedias()

            if (callback && typeof callback === 'function') {
              callback(res)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },

      updateTotalMedias() {
        let instance = this
        moderatorapi.getTotalMedias()
          .then((res) => {
            instance.$store.commit('setTotalMedias', res)
            if (instance.currentPage > instance.totalPages) {
              instance.$store.commit('setCurrentPage', instance.totalPages)
            } else if (instance.currentPage < 1) {
              instance.$store.commit('setCurrentPage', 1)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },

      goBackToList() {
        let query = `?count=${this.mediasPerPage}`
        if (this.stateFilter) {
          query += `&state=${this.stateFilter}`
        }
        this.$router.push(`/media/list/${this.currentPage}${query}`)
      },

      goToPreviousMedia() {
        let instance = this
        if (this.mediasList.length > 0 && (this.currentPage === 1 && this.mediaListPos === 0) === false) {
          if (this.mediaListPos === 0) {
            this.$store.commit('setCurrentPage', this.currentPage - 1)
            this.getMediasList(this.currentPage, this.mediasPerPage, this.stateFilter, function () {
              instance.$router.push(`${instance.mediasList[instance.mediasList.length - 1]._id}`)
              instance.getPageData()
            })
          } else {
            this.$router.push(`${this.mediasList[this.mediaListPos - 1]._id}`)
            this.getPageData()
          }
        }
      },

      goToNextMedia() {
        let instance = this
        if (this.mediasList.length > 0 && (this.currentPage === this.totalPages && this.mediaListPos === this.mediasList.length - 1) === false) {
          if (this.mediaListPos === this.mediasList.length - 1) {
            this.$store.commit('setCurrentPage', this.currentPage + 1)
            this.getMediasList(this.currentPage, this.mediasPerPage, this.stateFilter, function () {
              instance.$router.push(`${instance.mediasList[0]._id}`)
              instance.getPageData()
            })
          } else {
            this.$router.push(`${this.mediasList[this.mediaListPos + 1]._id}`)
            this.getPageData()
          }
        }
      },

      deleteFile(id) {
        let instance = this
        moderatorapi.deleteFile(id)
          .then((res) => {
            this.getMediasList(this.currentPage, this.mediasPerPage, this.stateFilter, function () {
              instance.$store.commit('', '')
              instance.$store.commit('setCurrentMedia', {})
              instance.currentMediaState = ''

              instance.goBackToList()
            })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }

</script>

<style>
.md-input-container::after {
  height: 0px;
}
</style>