<template>
  <div class="mylist">
    <div class="list-nav">
      <button v-on:click="goToPreviousPage">Prev</button>
      <span>Page {{ currentListPage + 1 }}</span>
      <button v-on:click="goToNextPage">Next</button> Items per page <input type="number" min="1" v-model="nbToDisplay" v-on:input="$store.commit('setNbFilesToDisplay', nbToDisplay)">
      <span>Total files: {{ filesList.length }}</span>
    </div>
    <table align="center" class="mylist-table">
      <tr class="mylist-line">
        <th></th>
        <th>Picture</th>
        <th class="filename-field">Filename</th>
        <th class="path-field">Path</th>
        <th class="state-field">State</th>
      </tr>
      <tr v-for="(item, index) in filesList" v-if="index >= (nbFilesToDisplay * currentListPage) && index < ((nbFilesToDisplay * currentListPage) + nbFilesToDisplay)"
        v-bind:class="[ 'mylist-line', index % 2 == 0 ? 'mylist-line-alt' : '' ]">
        <td class="delete-field"><button v-on:click="deleteItem(item._id)">Delete</button></td>
        <td><a v-bind:href="`${moderatorURL}/${item._id}`" target="_blank"><img v-bind:src="`${moderatorURL}/${item._id}`" width="200" height="200"></a></td>
        <td class="filename-field">{{ item.filename }}</td>
        <td class="path-field">{{ item.path }}</td>
        <td class="state-field">
          <input v-if="!states || states.length === 0" v-model="item.state" class="state-input" type="text" v-bind:disabled="!item.editing">
          <select v-else v-model="item.state" class="state-input">
            <option v-for="state in states" v-bind:value="state">{{ state }}</option>
          </select>
          <button v-if="(!states || states.length === 0) && item.editing === false" v-on:click="item.editing = true">Edit</button>
          <button v-else v-on:click="updateState(item._id, item.state)">Ok</button>
        </td>
      </tr>
    </table>
    <div class="list-nav">
      <button v-on:click="goToPreviousPage">Prev</button>
      <span>Page {{ currentListPage + 1}}</span>
      <button v-on:click="goToNextPage">Next</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
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
      states() {
        return this.$store.state.states
      }
    },

    created() {
      this.getFilesList()
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

      getFilesList() {
        let instance = this
        moderatorapi.getFilesList()
          .then((res) => {
            res.data.forEach((item) => {
              item.editing = false
            })
            instance.$store.commit('setFiles', res.data)
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
      },

      goToPreviousPage() {
        let newPage = this.currentListPage > 0 ? this.currentListPage - 1 : 0
        this.$store.commit('setCurrentListPage', newPage)
      },

      goToNextPage() {
        let newPage =
          this.currentListPage + 1 < ((this.filesList.length / this.nbFilesToDisplay)) ?
            this.currentListPage + 1 :
            this.currentListPage
        newPage = Math.max(Math.floor(newPage), 0)
        this.$store.commit('setCurrentListPage', newPage)
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

.list-nav {
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
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