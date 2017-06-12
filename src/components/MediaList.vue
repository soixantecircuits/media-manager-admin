<template>
  <md-table-card>
    <md-toolbar>
      <h1 class="md-title">File Moderation</h1>
    </md-toolbar>

    <media-list-pagination :statesList="statesList" :pageOptions="pageOptions"
                           :currentPage="currentPage" :totalPages="totalPages"
                           @stateFilterChanged="setStateFilter" @mediasPerPageChanged="setMediasPerPage"
                           @previousPage="goToPreviousPage" @nextPage="goToNextPage">
    </media-list-pagination>

    <div v-if="mediasList.length <= 0">
      <md-spinner md-indeterminate></md-spinner>
    </div>

    <media-list-table :mediasList="mediasList" :statesList="statesList" :moderatorURL="moderatorURL"
                      @stateChanged="setState" @deleteMedia="deleteMedia" @goToDetails="goToMediaDetails"></media-list-table>

    <media-list-pagination :statesList="statesList" :pageOptions="pageOptions"
                           :currentPage="currentPage" :totalPages="totalPages"
                           @stateFilterChanged="setStateFilter" @mediasPerPageChanged="setMediasPerPage"
                           @previousPage="goToPreviousPage" @nextPage="goToNextPage">
    </media-list-pagination>

  </md-table-card>
</template>

<script>
  import moderatorapi from '../lib/mediamanagerAPI'

  import ListPagination from './MediaListPagination'
  import ListTable from './MediaListTable'

  const config = SETTINGS

  let data = {
    listRefreshInterval: Math.abs(config.listRefreshInterval),
    pageOptions: config.nbDisplayedOptions || [ 10, 25, 50 ],
    perPage: 10,
    stateToFilter: 'any',
    interval: undefined
  }
  data.perPage = data.pageOptions[0]

  export default {
    data() {
      return data
    },

    components: {
      'media-list-pagination': ListPagination,
      'media-list-table': ListTable
    },

    computed: {
      stateFilter() {
        return this.$store.state.stateFilter
      },
      moderatorURL() {
        return `http://${config.service.mediaManager.server}${config.service.mediaManager.apiRoute}`
      },
      mediasList() {
        return this.$store.state.mediasList
      },
      totalMedias() {
        return this.$store.state.totalMedias
      },
      mediasPerPage() {
        return this.$store.state.mediasPerPage
      },
      currentPage() {
        return this.$store.state.currentPage
      },
      totalPages() {
        return Math.floor(this.totalMedias / this.mediasPerPage) + ((this.totalMedias % this.mediasPerPage) !== 0 ? 1 : 0)
      },
      statesList() {
        return this.$store.state.statesList
      }
    },

    created() {
      const instance = this

      if (this.$route.params.page) {
        let currPageParam = parseInt(this.$route.params.page, 10)
        this.$store.commit('setCurrentPage', currPageParam > 0 ? currPageParam : 1)
      }

      if (this.$route.query.count) {
        this.perPage = parseInt(this.$route.query.count, 10)
      }

      if (this.$route.query.state) {
        this.stateToFilter = this.$route.query.state
      }

      this.getServerConfig()
      .then((res) => {
        this.getBuckets()
        this.$store.commit('setMediasPerPage', this.perPage)
        this.$store.commit('setStateFilter', this.stateToFilter)
        let waitTime = this.listRefreshInterval * 1000

        let query = `?count=${this.mediasPerPage}`
        if (this.stateFilter) {
          query += `&state=${this.stateFilter}`
        }
        this.$router.push(`${this.currentPage}${query}`)

        this.refreshMediasList()
        this.interval = setInterval(this.refreshMediasList, waitTime)          
      })
      .catch((err) => {
        console.log(err)
      })
    },

    beforeDestroy () {
      clearInterval(this.interval)
    },

    methods: {
      getServerConfig() {
        let instance = this
        return new Promise((resolve, reject) => {
          moderatorapi.getConfig()
            .then((res) => {
              instance.$store.commit('setStatesList', res.states)
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

      getMediasList(page, perPage, state, callback) {
        let instance = this
        moderatorapi.getMediasList(page, perPage, state)
          .then((res) => {

            res.data.forEach((media) => {
              let timestamp = new Date(media.uploadedAt)
              media.uploadedAt = timestamp.toLocaleString()
              timestamp = new Date(media.updatedAt)
              media.updatedAt = timestamp.toLocaleString()
            })

            if (instance.isSameList(instance.mediasList, res.data) === false) {
              instance.$store.commit('setMediasList', res.data)
              instance.setTotalMedias()
            }

            if (callback && typeof callback === 'function') {
              callback(res)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },

      refreshMediasList() {
        this.getMediasList(this.currentPage, this.mediasPerPage, this.stateFilter)
        this.setTotalMedias()
      },

      setTotalMedias() {
        let instance = this
        moderatorapi.getTotalMedias(instance.stateFilter)
          .then((res) => {
            instance.$store.commit('setTotalMedias', res)
            if (instance.currentPage > instance.totalPages) {
              instance.$store.commit('setCurrentPage', instance.totalPages > 0 ? instance.totalPages : 1)
            } else if (instance.currentPage < 1) {
              instance.$store.commit('setCurrentPage', 1)
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },

      setMediasPerPage(nb) {
        this.$store.commit('setMediasPerPage', nb)
        let query = `?count=${this.mediasPerPage}`
        if (this.stateFilter) {
          query += `&state=${this.stateFilter}`
        }
        this.$router.push(`${this.currentPage}${query}`)
        this.refreshMediasList()
      },

      setStateFilter(state) {
        this.$store.commit('setStateFilter', state)
        let query = `?count=${this.mediasPerPage}`
        if (this.stateFilter) {
          query += `&state=${this.stateFilter}`
        }
        this.$router.push(`${this.currentPage}${query}`)
        this.refreshMediasList()
      },

      setState(id, state) {
        moderatorapi.setState(id, state)
          .catch((err) => {
            console.log(err)
          })
      },

      deleteMedia(id) {
        moderatorapi.deleteFile(id)
          .then((res) => {
            this.refreshMediasList()
          })
          .catch((err) => {
            console.log(err)
          })
      },

      goToPreviousPage() {
        if (this.currentPage > 1) {
          let instance = this

          this.getMediasList(this.currentPage - 1, this.mediasPerPage, this.stateFilter, (res) => {
            instance.$store.commit('setCurrentPage', instance.currentPage - 1)
            let query = `?count=${instance.mediasPerPage}`
            if (instance.stateFilter) {
              query += `&state=${instance.stateFilter}`
            }
            instance.$router.push(`${instance.currentPage}${query}`)
          })
        }
      },

      goToNextPage() {
        if (this.currentPage < this.totalPages) {
          let instance = this

          this.getMediasList(this.currentPage + 1, this.mediasPerPage, this.stateFilter, (res) => {
            instance.$store.commit('setCurrentPage', instance.currentPage + 1)
            let query = `?count=${instance.mediasPerPage}`
            if (instance.stateFilter) {
              query += `&state=${instance.stateFilter}`
            }
            instance.$router.push(`/media/list/${instance.currentPage}${query}`)
          })
        }
      },

      goToMediaDetails(id) {
        this.$router.push(`/media/details/${id}`)          
      },

      isSameList(list1, list2) {
        if (list1.length !== list2.length) {
          return false
        }

        for (let i = 0; i < list1.length; ++i) {
          let item1 = list1[i]
          let item2 = list2[i]

          if (item1._id !== item2._id ||
              item1.filename !== item2.filename ||
              item1.path !== item2.path ||
              item1.state !== item2.state ||
              item1.type !== item2.type ||
              item1.updatedAt !== item2.updatedAt ||
              item1.uploadedAt !== item2.uploadedAt)
              return false
        }
        return true
      }
    }

  }
</script>

<style>
.md-button.md-fab .md-icon
{
  top: 9px;
  left: 9px;
}
</style>