<template>
  <md-table-card style="padding-left: 10%; padding-right: 10%;">
<md-toolbar>
  <h1 class="md-title">File Moderation</h1>
</md-toolbar>

<div>
  <md-button @click="goToPreviousPage">Prev</md-button>
  <md-button @click="goToNextPage">Next</md-button>
  <md-input-container style="width:10%;">
<label for="toDisplay">Files per page</label>
<md-select v-model="nbToDisplay" @change="$store.commit('setNbFilesToDisplay', nbToDisplay)">
  <md-option :value="5">5</md-option>
  <md-option :value="10">10</md-option>
  <md-option :value="25">25</md-option>
  <md-option :value="50">50</md-option>
</md-select>
</md-input-container>
</div>

<md-table>
  <md-table-header>
    <md-table-row>
      <md-table-head>Delete</md-table-head>
      <md-table-head>Picture</md-table-head>
      <md-table-head md-sort-by="filename">Filename</md-table-head>
      <md-table-head md-sort-by="path">Path</md-table-head>
      <md-table-head md-sort-by="state">State</md-table-head>
    </md-table-row>
  </md-table-header>

  <md-table-body>
    <md-table-row v-for="(row, rowIndex) in filesList" :key="rowIndex" :md-item="row">
      <md-table-cell>
        <md-button class="md-raised md-warn" style="min-width:82px;" @click="deleteFile(row._id)">Delete</md-button>
</md-table-cell>
<md-table-cell>
  <md-image :md-src="`${moderatorURL}/${row._id}`" width="200" height="200"></md-image>
</md-table-cell>
<md-table-cell align="left">{{ row.filename }}</md-table-cell>
<md-table-cell align="left">{{ row.path }}</md-table-cell>
<md-table-cell align="left">
  <md-input-container>
    <md-select v-model="row.state" @change="updateState(row._id, row.state)">
      <md-option v-for="state in states" :value="state">{{ state }}</md-option>
    </md-select>
  </md-input-container>
</md-table-cell>
</md-table-row>
</md-table-body>
</md-table>

<!--<md-table-pagination v-bind:md-size="nbFilesToDisplay" v-bind:md-total="filesList.length" v-bind:md-page="1" md-label="Files"
  md-separator="of" :md-page-options="[5, 10, 25, 50]"></md-table-pagination>-->
</md-table-card>
</template>

<script>
  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import config from '../../settings/default.json'
  import moderatorapi from '../lib/mediamoderatorAPI'

  let data = {
    nbToDisplay: config.filesPerPage,
  }

  export default {
    data() {
      return data
    },

    computed: {
      moderatorURL() {
        return `http://${config.moderatorServer}${config.apiRoute}`
      },
      filesList() {
        return this.$store.state.filesList
      },
      nbFilesToDisplay() {
        return this.$store.state.nbFilesToDisplay
      },
      currentListPage() {
        return this.$store.state.currentListPage
      },
      firstCursor() {
        return this.$store.state.firstCursor
      },
      lastCursor() {
        return this.$store.state.lastCursor
      },
      states() {
        return this.$store.state.states
      }
    },

    created() {
      this.getFilesList(this.nbToDisplay, undefined, undefined, this.timeoutGetFiles)
      this.getServerConfig()
    },

    mounted() {
      this.nbToDisplay = config.filesPerPage
      this.$store.commit('setNbFilesToDisplay', this.nbToDisplay)
    },

    methods: {
      getServerConfig() {
        let instance = this
        moderatorapi.getConfig()
          .then((res) => {
            instance.$store.commit('setStates', res.states)
          })
          .catch((err) => {
            console.log(err)
          })
      },

      timeoutGetFiles() {
        let instance = this
        setTimeout(function () {
          instance.getFilesList(instance.nbFilesToDisplay, instance.firstCursor, instance.stateToSearch, instance.timeoutGetFiles)
        }, config.listRefreshInterval * 1000);
      },

      getFilesList(limit, cursor, state, callback) {
        let instance = this
        moderatorapi.getFilesList(limit, cursor, state)
          .then((res) => {

            instance.$store.commit('setFiles', res.data)
            instance.$store.commit('setLastCursor', res.lastCursor)

            if (callback && typeof callback === 'function') {
              callback(res)
            }
          })
          .catch((err) => {
            console.log(err)
            setTimeout(function () {
              instance.getFilesList(limit, cursor, state, callback)
            }, config.listRefreshInterval * 1000);
          })
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
        let instance = this
        this.getFilesList(-this.nbFilesToDisplay, this.firstCursor, this.stateToSearch, (res) => {
          instance.$store.commit('setFirstCursor', res.firstCursor)
        })
      },

      goToNextPage() {
        this.$store.commit('setFirstCursor', this.lastCursor)
        this.getFilesList(this.nbFilesToDisplay, this.lastCursor, this.stateToSearch)
      }
    }

  }
</script>

<style>

</style>