<template>
  <md-table-card>
    <md-toolbar>
      <h1 class="md-title">File Moderation</h1>
    </md-toolbar>

  <div class="md-table-pagination">
    <span class="md-table-pagination-label">Files per page :</span>

    <md-select v-model="nbToDisplay" md-menu-class="md-pagination-select" @change="updateNbFilesToDisplay(nbToDisplay)" v-if="pageOptions">
      <md-option v-for="amount in pageOptions" :value="amount">{{ amount }}</md-option>
    </md-select>

    <span>Page {{ currentPage }} of {{ nbPages }}</span>

    <md-button class="md-icon-button md-table-pagination-previous" @click="goToPreviousPage" :disabled="currentPage === 1">
      <md-icon>keyboard_arrow_left</md-icon>
    </md-button>

    <md-button class="md-icon-button md-table-pagination-next" @click="goToNextPage" :disabled="currentPage >= nbPages">
      <md-icon>keyboard_arrow_right</md-icon>
    </md-button>
  </div>

<md-table>
  <md-table-header>
    <md-table-row>
      <md-table-head>Delete</md-table-head>
      <md-table-head>ID</md-table-head>
      <md-table-head>Filename</md-table-head>
      <md-table-head>Created at</md-table-head>
      <md-table-head>Last Update</md-table-head>
      <md-table-head>Picture</md-table-head>
      <md-table-head>State</md-table-head>
    </md-table-row>
  </md-table-header>

  <md-table-body>
    <md-table-row v-for="(row, rowIndex) in filesList" :key="rowIndex" :md-item="row">
      <md-table-cell>
        <md-button class="md-fab md-clean" @click="deleteFile(row._id)"><md-icon>delete</md-icon></md-button>
      </md-table-cell>
      <md-table-cell align="left"><a @click="goToMediaDetails(row._id)" style="cursor: pointer;">{{ row._id }}</a></md-table-cell>
      <md-table-cell align="left"><a @click="goToMediaDetails(row._id)" style="cursor: pointer;">{{ row.filename }}</a></md-table-cell>
      <md-table-cell align="left">{{ row.uploadedAt }}</md-table-cell>
      <md-table-cell align="left">soon</md-table-cell>
      <md-table-cell>
        <a @click="goToMediaDetails(row._id)" style="cursor: pointer;">
          <md-image :md-src="`${moderatorURL}/${row._id}`" style="max-width:200px; max-height:200px;" width="auto" height="auto"></md-image>
        </a>
      </md-table-cell>
      <md-table-cell align="left">
        <md-input-container>
          <md-select v-model="row.state" @change="updateState(row._id, row.state)">
            <md-option v-for="state in states" :value="state">{{ state }}</md-option>
          </md-select>
        </md-input-container>
      </md-table-cell>
    </md-table-row>
    <md-spinner  v-if="filesList.length <= 0" md-indeterminate align="center"></md-spinner>
  </md-table-body>
</md-table>

  <div class="md-table-pagination">
    <span class="md-table-pagination-label">Files per page :</span>

    <md-select v-model="nbToDisplay" md-menu-class="md-pagination-select" @change="updateNbFilesToDisplay(nbToDisplay)" v-if="pageOptions">
      <md-option v-for="amount in pageOptions" :value="amount">{{ amount }}</md-option>
    </md-select>

    <span>Page {{ currentPage }} of {{ nbPages }}</span>

    <md-button class="md-icon-button md-table-pagination-previous" @click="goToPreviousPage" :disabled="currentPage === 1">
      <md-icon>keyboard_arrow_left</md-icon>
    </md-button>

    <md-button class="md-icon-button md-table-pagination-next" @click="goToNextPage" :disabled="currentPage >= nbPages">
      <md-icon>keyboard_arrow_right</md-icon>
    </md-button>
  </div>

</md-table-card>
</template>

<script>
  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import config from '../../settings/default.json'
  import moderatorapi from '../lib/mediamoderatorAPI'

  let data = {
    listRefreshInterval: Math.abs(config.listRefreshInterval),
    pageOptions: config.nbDisplayedOptions || [ 10, 25, 50 ],
    nbToDisplay: 10,
    interval: undefined
  }
  data.nbToDisplay = data.pageOptions[0]

  export default {
    data() {
      return data
    },

    computed: {
      stateToSearch() {
        return this.$store.state.stateToSearch
      },
      moderatorURL() {
        return `http://${config.moderatorServer}${config.apiRoute}`
      },
      filesList() {
        return this.$store.state.filesList
      },
      filesCount() {
        return this.$store.state.filesCount
      },
      nbFilesToDisplay() {
        return this.$store.state.nbFilesToDisplay
      },
      currentPage() {
        return this.$store.state.currentPage
      },
      nbPages() {
        return Math.floor(this.$store.state.filesCount / this.$store.state.nbFilesToDisplay) + ((this.$store.state.filesCount % this.$store.state.nbFilesToDisplay) !== 0 ? 1 : 0)
      },
      states() {
        return this.$store.state.states
      }
    },

    created() {
      if (this.$route.params.page) {
        this.$store.commit('setCurrentPage', parseInt(this.$route.params.page, 10))
      }

      if (this.$route.query.count) {
        this.nbToDisplay = this.$route.query.count
        this.$store.commit('setNbFilesToDisplay', parseInt(this.nbToDisplay, 10))
      }

      if (this.$route.query.state) {
        this.$store.commit('setStateToSearch', this.$route.query.state)
      }

      this.getServerConfig()
        .then((res) => {
          this.$store.commit('setNbFilesToDisplay', this.nbToDisplay)
          let waitTime = this.listRefreshInterval * 1000
          this.interval = setInterval(this.getFilesList(this.currentPage, this.nbFilesToDisplay, this.stateToSearch), waitTime)          
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
              instance.$store.commit('setStates', res.states)
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },

      timeoutGetFiles() {
        let instance = this
        let waitTime = instance.listRefreshInterval * 1000
        instance.interval = setInterval(function timeoutGetFilesList() {
          instance.getFilesList(instance.currentPage, instance.nbFilesToDisplay, instance.stateToSearch, instance.timeoutGetFiles)
        }, waitTime);
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

      updateNbFilesToDisplay(nb) {
        this.$store.commit('setNbFilesToDisplay', nb)
        this.getFilesList(this.currentPage, this.nbFilesToDisplay, this.stateToSearch)
      },

      updateState(id, state) {
        moderatorapi.updateState(id, state)
          .catch((err) => {
            console.log(err)
          })
      },

      deleteFile(id) {
        moderatorapi.deleteFile(id)
          .then((res) => {
            let itemToDelete = this.filesList.find(item => item._id === id)
            let index = this.filesList.indexOf(itemToDelete)
            this.filesList.splice(index, 1)
            console.log('Deleted file ' + id)
          })
          .catch((err) => {
            console.log(err)
          })
      },

      goToPreviousPage() {
        if (this.currentPage > 1) {
          let instance = this
          this.getFilesList(this.currentPage - 1, this.nbFilesToDisplay, this.stateToSearch, (res) => {
            instance.$store.commit('setCurrentPage', instance.currentPage - 1)
            let query = `?count=${instance.nbToDisplayer}`
            if (instance.stateToSearch) {
              query += '&state=${instance.stateToSearch}'
            }
            instance.$router.push(`${instance.currentPage}${query}`)
          })
        }
      },

      goToNextPage() {
        if (this.currentPage < this.nbPages) {
          let instance = this
          this.getFilesList(this.currentPage + 1, this.nbFilesToDisplay, this.stateToSearch, (res) => {
            instance.$store.commit('setCurrentPage', instance.currentPage + 1)
            instance.$router.push(`/medias/list/${instance.currentPage}`)
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