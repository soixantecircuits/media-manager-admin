<template>
  <md-table-card>
    <md-toolbar>
      <h1 class="md-title">File Moderation</h1>
    </md-toolbar>

    <media-list-pagination :statesList="statesList" :pageOptions="pageOptions"
                           :currentPage="currentPage" :totalPages="totalPages"
                           :stateFilter="stateFilter" :mediasPerPage="mediasPerPage"
                           @stateFilterChanged="setStateFilter" @mediasPerPageChanged="setMediasPerPage"
                           @previousPage="goToPreviousPage" @nextPage="goToNextPage">
    </media-list-pagination>

    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head>Delete</md-table-head>
          <md-table-head>ID</md-table-head>
          <md-table-head>Filename</md-table-head>
          <md-table-head>Created at</md-table-head>
          <md-table-head>Last Update</md-table-head>
          <md-table-head>Media</md-table-head>
          <md-table-head>State</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(row, rowIndex) in mediasList" :key="rowIndex" :md-item="row">
          <md-table-cell>
            <md-button class="md-fab md-clean" @click="deleteFile(row._id)"><md-icon>delete</md-icon></md-button>
          </md-table-cell>
          <md-table-cell align="left"><a @click="goToMediaDetails(row._id)" style="cursor: pointer;">{{ row._id }}</a></md-table-cell>
          <md-table-cell align="left"><a @click="goToMediaDetails(row._id)" style="cursor: pointer;">{{ row.filename }}</a></md-table-cell>
          <md-table-cell align="left">{{ row.uploadedAt }}</md-table-cell>
          <md-table-cell align="left">{{ row.updatedAt }}</md-table-cell>
          <md-table-cell align="left">
            <a @click="goToMediaDetails(row._id)" style="cursor: pointer;">
              <b v-if="row.type.search('video') !== -1">View video</b>
              <md-image v-else :md-src="`${moderatorURL}/${row._id}`" style="max-width:200px; max-height:200px;" width="auto" height="auto"></md-image>
            </a>
          </md-table-cell>
          <md-table-cell align="left">
            <md-input-container>
              <md-select v-model="row.state" @change="setState(row._id, row.state)">
                <md-option v-for="state in statesList" :value="state">{{ state }}</md-option>
              </md-select>
            </md-input-container>
          </md-table-cell>
        </md-table-row>
        <md-spinner  v-if="mediasList.length <= 0" md-indeterminate style="margin-left: auto; margin-right: auto;"></md-spinner>
      </md-table-body>
    </md-table>

    <media-list-pagination :statesList="statesList" :pageOptions="pageOptions"
                           :currentPage="currentPage" :totalPages="totalPages"
                           :stateFilter="stateFilter" :mediasPerPage="mediasPerPage"
                           @stateFilterChanged="setStateFilter" @mediasPerPageChanged="setMediasPerPage"
                           @previousPage="goToPreviousPage" @nextPage="goToNextPage">
    </media-list-pagination>

  </md-table-card>
</template>

<script>
  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import config from '../../settings/default.json'
  import moderatorapi from '../lib/mediamoderatorAPI'

  import ListPagination from './MediaListPagination'

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
      'media-list-pagination': ListPagination
    },

    computed: {
      stateFilter() {
        return this.$store.state.stateFilter
      },
      moderatorURL() {
        return `http://${config.moderatorServer}${config.apiRoute}`
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
      if (this.$route.params.page) {
        this.$store.commit('setCurrentPage', parseInt(this.$route.params.page, 10))
      }

      if (this.$route.query.count) {
        this.perPage = parseInt(this.$route.query.count, 10)
      }

      if (this.$route.query.state) {
        this.stateToFilter = this.$route.query.state
      }

      this.getServerConfig()
      .then((res) => {
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

    mounted() {
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

            instance.$store.commit('setMediasList', res.data)
            instance.setTotalMedias()

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
      },

      setTotalMedias() {
        let instance = this
        moderatorapi.getTotalMedias(instance.stateFilter)
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

      deleteFile(id) {
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
            instance.$router.push(`/medias/list/${instance.currentPage}${query}`)
          })
        }
      },

      goToMediaDetails(id) {
        this.$router.push(`/medias/details/${id}`)          
      }
    }

  }
</script>

<style>
</style>