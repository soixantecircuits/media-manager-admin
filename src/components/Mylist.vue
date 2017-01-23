<template>
  <md-table-card>
    <md-toolbar>
      <h1 class="md-title">File Moderation</h1>
      <md-button class="md-icon-button">
        <md-icon>filter_list</md-icon>
      </md-button>

      <md-button class="md-icon-button">
        <md-icon>search</md-icon>
      </md-button>
    </md-toolbar>

    <md-table>
      <md-table-header>
        <md-table-row>
          <md-table-head md-sort-by="filename">Filename</md-table-head>
          <md-table-head md-sort-by="path">Path</md-table-head>
          <md-table-head md-sort-by="state">State</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(row, rowIndex) in filesList" :key="rowIndex" :md-item="row" md-auto-select md-selection>
          <md-table-cell :key="0">{{ row.filename }}</md-table-cell>
          <md-table-cell :key="1">{{ row.path }}</md-table-cell>
          <md-table-cell :key="2">{{ row.state }}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <md-table-pagination v-bind:md-size="nbFilesToDisplay" v-bind:md-total="filesList.length" v-bind:md-page="currentListPage" md-label="Files" md-separator="of" :md-page-options="[5, 10, 25, 50]"></md-table-pagination>
  </md-table-card>

  <!--<div class="mylist">
    <listnav></listnav>
    <mylist-table></mylist-table>
    <listnav></listnav>
  </div>-->
</template>

<script>
  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import ListNav from './ListNav.vue'
  import MylistTable from './MylistTable.vue'
  import config from '../../settings/default.json'
  import moderatorapi from '../lib/mediamoderatorAPI'

  let data = {
    nbToDisplay: config.filesPerPage,
  }

  export default {
    data() {
      return data
    },

    components: {
      'listnav': ListNav,
      'mylist-table': MylistTable
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
      this.getFilesList(this.nbToDisplay)
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

      getFilesList(limit, cursor, state) {
        let instance = this
        moderatorapi.getFilesList(limit, cursor, state)
          .then((res) => {
            res.data.forEach((item) => {
              item.editing = false
            })
            instance.$store.commit('setFiles', res.data)
            instance.$store.commit('setFirstCursor', res.firstCursor)
            instance.$store.commit('setLastCursor', res.lastCursor)
            setTimeout(function () {
              instance.getFilesList()
            }, config.listRefreshInterval * 1000);
          })
          .catch((err) => {
            console.log(err)
            setTimeout(function () {
              instance.getFilesList()
            }, config.listRefreshInterval * 1000);
          })
      },

      getStatesList() {
        moderatorapi.getStatesList()
          .then((res) => {

          })
          .catch((err) => {
            console.log(err)
          })
      },

      updateState(id, state) {
        moderatorapi.updateState(id, state)
          .then((res) => {
            let item = this.filesList.find(elem => elem._id === id)
            item.editing = false
          })
          .catch((err) => {
            console.log(err)
          })
      },

      deleteItem(id) {
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
      }
    }

  }
</script>

<style>
.mylist {
  margin: 100px auto;
  text-align: left;
  line-height: 40px;
  user-select: none;
}

.mylist-table {
  width: 80%;
  background-color: #f0f0f0;
  border-style: solid;
  border-width: 0px 4px 0px 4px;
}

.mylist-line {
  border-style: solid;
  border-width: 1px 0px 1px 0px;
}

.mylist-line-alt {
  background-color: #d0d0d0;
}

.delete-field {
  width: 10%;
}
.filename-field {
  width: 30%;
}

.path-field {
  width: 40%;
}

.state-field {
  width: 20%;
}

.state-input {
  width: 60%;
}
</style>