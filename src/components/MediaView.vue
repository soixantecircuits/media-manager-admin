<template>
  <div>
    <media-view-toolbar
        @back="goBackToList"
        @previous="goToPreviousMedia"
        @next="goToNextMedia"
        @delete="deleteFile(mediaID)"
        :show-navigation="mediasList.length > 0"
        :allow-previous="currentPage !== 1 || currentPage === 1 && mediaID !== mediasList[0]._id"
        :allow-next="currentPage !== totalPages || currentPage === totalPages && mediaID !== mediasList[mediasList.length - 1]._id">
    </media-view-toolbar>
    <md-layout md-row>
      <md-layout md-column :md-flex="50" class="section">
        <media-preview :media="media"></media-preview>
        <media-info :media="media" @state-changed="setState"></media-info>
        <media-edit-parts :media="media"></media-edit-parts>
      </md-layout>
      <md-layout :md-flex="50"></md-layout>
    </md-layout>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moderatorapi from '../lib/mediamanagerAPI'
  import MediaViewToolbar from './MediaView/MediaViewToolbar.vue'
  import MediaPreview from './MediaView/MediaPreview.vue'
  import MediaInfo from './MediaView/MediaInfo.vue'
  import MediaEditParts from './MediaView/MediaEditParts.vue'
  const config = SETTINGS

  let data = {
    currentMediaState: '',
  }

  export default {
    components: {
      MediaEditParts,
      MediaInfo,
      MediaPreview,
      MediaViewToolbar
    },
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

<style lang="scss" scoped>
  .md-input-container::after {
    height: 0px;
  }

  .md-input-container > label {
    top: 7px;
  }

  .section {
    padding: 10px;
    text-align: left;
  }
</style>