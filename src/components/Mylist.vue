<template>
  <md-table-card>
    <md-toolbar>
      <h1 class="md-title">File Moderation</h1>
    </md-toolbar>

    <!--<div>
      <md-input-container style="width:10%; text-align:center;">
<label for="toDisplay">Displayed Files</label>
<md-select v-model="nbToDisplay" @change="updateNbFilesToDisplay(nbToDisplay)">
  <md-option :value="5">5</md-option>
  <md-option :value="10">10</md-option>
  <md-option :value="25">25</md-option>
  <md-option :value="50">50</md-option>
</md-select>
<span style="min-width:50px">Out of {{ filesCount }}</span>
</md-input-container>

<md-button v-show="currentPage > 1" @click="goToPreviousPage">Prev</md-button>
<md-button v-show="currentPage <= 1" @click="goToPreviousPage" disabled>Prev</md-button>
<md-button>Page {{ currentPage }}</md-button>
<md-button v-show="currentPage < nbPages" @click="goToNextPage">Next</md-button>
<md-button v-show="currentPage >= nbPages" @click="goToNextPage" disabled>Next</md-button>
</div>-->

  <div class="md-table-pagination">
    <span class="md-table-pagination-label">Files :</span>

    <md-select v-model="nbToDisplay" md-menu-class="md-pagination-select" @change="updateNbFilesToDisplay(nbToDisplay)" v-if="pageOptions">
      <md-option v-for="amount in pageOptions" :value="amount">{{ amount }}</md-option>
    </md-select>

    <span>{{ ((currentPage - 1) * nbFilesToDisplay) + 1 }}-{{ currentPage * nbFilesToDisplay }} of {{ filesCount }}</span>

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
      <md-table-head>Filename</md-table-head>
      <md-table-head>Path</md-table-head>
      <md-table-head>Picture</md-table-head>
      <md-table-head>State</md-table-head>
    </md-table-row>
  </md-table-header>

  <md-table-body>
    <md-table-row v-for="(row, rowIndex) in filesList" :key="rowIndex" :md-item="row">
      <md-table-cell>
        <md-button class="md-raised md-warn" style="min-width:82px;" @click="deleteFile(row._id)">Delete</md-button>
      </md-table-cell>
      <md-table-cell align="left">{{ row.filename }}</md-table-cell>
      <md-table-cell align="left">{{ row.path }}</md-table-cell>
      <md-table-cell>
        <a :href="`${moderatorURL}/${row._id}`" target="_blank">
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
    <span class="md-table-pagination-label">Files :</span>

    <md-select v-model="nbToDisplay" md-menu-class="md-pagination-select" @change="updateNbFilesToDisplay(nbToDisplay)" v-if="pageOptions">
      <md-option v-for="amount in pageOptions" :value="amount">{{ amount }}</md-option>
    </md-select>

    <span>{{ ((currentPage - 1) * nbFilesToDisplay) + 1 }}-{{ currentPage * nbFilesToDisplay }} of {{ filesCount }}</span>

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
        this.$store.commit('setCurrentPage', this.$route.params.page)
      }

      if (this.$route.query.state) {
        this.$store.commit('setStateToSearch', this.$route.query.state)
      }

      this.getServerConfig()
        .then((res) => {
          this.$store.commit('setNbFilesToDisplay', this.nbToDisplay)
          this.getFilesList(this.currentPage, this.nbFilesToDisplay, this.stateToSeach, this.timeoutGetFiles)
        })
        .catch((err) => {
          console.log(err)
        })
    },

    mounted() {
      this.$store.commit('setNbFilesToDisplay', this.nbToDisplay)
      this.getFilesList(this.currentPage, this.nbFilesToDisplay, this.stateToSeach, this.timeoutGetFiles)
    },

    methods: {
      getServerConfig() {
        let instance = this
        return new Promise((resolve, reject) => {
          moderatorapi.getConfig()
            .then((res) => {
              instance.$store.commit('setStates', res.states)
              resolve()
            })
            .catch((err) => {
              reject(err)
            })
        })
      },

      timeoutGetFiles() {
        let instance = this
        let waitTime = instance.listRefreshInterval * 1000
        setTimeout(function timeoutGetFilesList() {
          instance.getFilesList(instance.currentPage, instance.nbFilesToDisplay, instance.stateToSearch, instance.timeoutGetFiles)
        }, waitTime);
      },

      getFilesList(page, per_page, state, callback) {
        let instance = this
        moderatorapi.getFilesList(page, per_page, state)
          .then((res) => {

            instance.$store.commit('setFiles', res.data)
            instance.updateFilesCount()

            if (callback && typeof callback === 'function') {
              callback(res)
            }
          })
          .catch((err) => {
            console.log(err)
            setTimeout(function () {
              instance.getFilesList(page, per_page, state, callback)
            }, config.listRefreshInterval * 1000);
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
          .then((res) => {
            let item = this.filesList.find(elem => elem._id === id)
          })
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
            instance.$router.push(`${instance.currentPage}`)
          })
        }
      },

      goToNextPage() {
        if (this.currentPage < this.nbPages) {
          let instance = this
          this.getFilesList(this.currentPage + 1, this.nbFilesToDisplay, this.stateToSearch, (res) => {
            instance.$store.commit('setCurrentPage', instance.currentPage + 1)
            instance.$router.push(`${instance.currentPage}`)
          })
        }
      }
    }

  }
</script>

<style>

</style>