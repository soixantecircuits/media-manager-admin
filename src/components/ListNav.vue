<template>
  <div class="listnav">
    <button v-on:click="goToPreviousPage">Prev</button>
    <span>Page {{ currentListPage + 1 }}</span>
    <button v-on:click="goToNextPage">Next</button> Items per page <input type="number" min="1" v-model="nbToDisplay" v-on:input="$store.commit('setNbFilesToDisplay', nbToDisplay)">
    <span>Total files: {{ filesList.length }}</span>
  </div>
</template>

<script>
  import Vue from 'vue'
  import config from '../../settings/default.json'

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
      }
    },

    methods: {
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
.listnav {
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
}
</style>