<template>
  <div>

    <md-toolbar md-theme="grey">
      <md-button class="md-primary" @click="goBackToList()">Back to list</md-button>
      <div style="flex: 1;"></div>
      <md-button v-if="mediasList.length > 0" :disabled="currentPage === 1 && mediaId === mediasList[0]._id" @click="goToPreviousMedia">Previous</md-button>
      <md-button v-if="mediasList.length > 0" :disabled="currentPage === nbPages && mediaId === mediasList[mediasList.length - 1]._id" @click="goToNextMedia">Next</md-button>
      <div style="flex: 1;"></div>
      <md-button @click="deleteFile(mediaId)">Delete this file</md-button>
    </md-toolbar>

    <md-layout>

    <md-layout md-flex="60" md-flex-offset="20" md-row style="border-radius: 8px;">
      <md-layout md-flex>
        <md-card style="background: black; width: 100%;">
          <md-card-media style="margin: auto;">
            <video v-if="mediaType.search('video') !== -1" :src="`${moderatorURL}/${mediaId}`" controls></video>
            <md-image v-else :md-src="`${moderatorURL}/${mediaId}`" alt="Media"></md-image>
          </md-card-media>
        </md-card>
      </md-layout>

      <md-layout md-flex>
        <md-card style="height: 100%;">
          <md-card-area md-inset>
            <md-card-header>
              <h2 class="md-title">{{ mediaName }}</h2>
            </md-card-header>
          </md-card-area>

          <md-card-area md-inset>
            <md-input-container style="height: 0; padding: 8px 16px; margin: 0;">
              <label for="state" style="position: relative;"><b>State</b></label>
              <md-select name="state" v-model="currentMediaState" @change="updateState(currentMediaState)" md-align-trigger>
                <md-option v-for="state in states" :value="state">{{ state }}</md-option>
              </md-select>
            </md-input-container>
          </md-card-area>

          <md-card-area md-inset>
            <md-card-content v-if="mediaMetas && Object.keys(mediaMetas).length > 0">
              <md-table>
                <md-table-row>
                  <md-table-cell style="text-align: left;"><b>Uploaded at: </b></md-table-cell><md-table-cell style="text-align: left;">{{ mediaUploadedAt }}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell style="text-align: left;"><b>ID: </b></md-table-cell><md-table-cell style="text-align: left;">{{ mediaId }}</md-table-cell>
                </md-table-row>

                <md-table-row v-for="(value, key) in mediaMetas">
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
      this.getPageData()
    },

    computed: {
      moderatorURL() {
        return `http://${config.moderatorServer}${config.apiRoute}`
      },
      currentPage() {
        return this.$store.state.currentPage
      },
      mediasList () {
        return this.$store.state.filesList
      },
      states() {
        return this.$store.state.states
      },
      mediaListPos() {
        let instance = this
        if (this.mediasList.length > 0) {
          return this.mediasList.findIndex((element) => {
            return element._id === instance.mediaId
          })
        } else {
          return -1
        }
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
      mediaType() {
        return this.$store.state.currentMediaType
      },
      mediaInfos() {
        return this.$store.state.currentMediaInfos
      },
      mediaMetas() {
        return {
          sharedOnFacebook: 'yes',
          printed: '5 times',
          tweeted: '02/13/17, Friday, 23:12:42',
          url: "www.whatev.er"
        }
        return this.$store.state.currentMediaMetas
      },
      nbPages() {
        return Math.floor(this.$store.state.filesCount / this.$store.state.nbFilesToDisplay) + ((this.$store.state.filesCount % this.$store.state.nbFilesToDisplay) !== 0 ? 1 : 0)
      }
    },

    methods: {
      getPageData() {
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
            instance.$store.commit('setCurrentMediaType', res.type)
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
      },

      goToPreviousMedia() {
        let instance = this
        if (this.mediasList.length > 0 && (this.currentPage === 1 && this.mediaListPos === 0) === false) {
          if (this.mediaListPos === 0) {
            this.$store.commit('setCurrentPage', this.currentPage - 1)
            this.getFilesList(this.$store.state.currentPage, this.$store.state.nbFilesToDisplay, this.$store.state.stateToSearch, function () {
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
        if (this.mediasList.length > 0 && (this.currentPage === this.nbPages && this.mediaListPos === this.mediasList.length - 1) === false) {
          if (this.mediaListPos === this.mediasList.length - 1) {
            this.$store.commit('setCurrentPage', this.currentPage + 1)
            this.getFilesList(this.$store.state.currentPage, this.$store.state.nbFilesToDisplay, this.$store.state.stateToSearch, function () {
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
            this.getFilesList(this.$store.state.currentPage, this.$store.state.nbFilesToDisplay, this.$store.state.stateToSearch, function () {
              instance.$store.commit('setCurrentMediaId', '')
              instance.$store.commit('setCurrentMediaName', '')
              instance.$store.commit('setCurrentMediaState', '')
              instance.currentMediaState = ''
              instance.$store.commit('setCurrentMediaUploadedAt', '')
              instance.$store.commit('setCurrentMediaType', '')
              instance.$store.commit('setCurrentMediaInfos', {})
              instance.$store.commit('setCurrentMediaMetas', {})

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