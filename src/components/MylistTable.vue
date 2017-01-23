<template>
  <table align="center" class="mylist-table">
    <tr class="mylist-line">
      <th></th>
      <th>Picture</th>
      <th class="filename-field">Filename</th>
      <th class="path-field">Path</th>
      <th class="state-field">State</th>
    </tr>
    <mylist-files></mylist-files>
  </table>
</template>

<script>
  import Vue from 'vue'
  import MylistFiles from './MylistFiles.vue'
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
      'mylist-files': MylistFiles
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

    methods: {
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
</style>