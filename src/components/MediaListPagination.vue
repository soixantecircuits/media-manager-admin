<template>
  <div class="md-table-pagination">
    <span class="md-table-pagination-label">Filter by state :</span>
    <md-select v-model="stateToFilter" md-menu-class="md-pagination-select" @change="$emit('stateFilterChanged', stateToFilter)" v-if="statesList">
      <md-option value="any">Any</md-option>
      <md-option v-for="state in statesList" :value="state">{{ state }}</md-option>
    </md-select>

    <span class="md-table-pagination-label">Files per page :</span>
    <md-select v-model="perPage" md-menu-class="md-pagination-select" @change="$emit('mediasPerPageChanged', perPage)" v-if="pageOptions">
      <md-option v-for="amount in pageOptions" :value="amount">{{ amount }}</md-option>
    </md-select>

    <span>Page {{ currentPage }} of {{ totalPages }}</span>

    <md-button class="md-icon-button md-table-pagination-previous" @click="$emit('previousPage')" :disabled="currentPage === 1">
      <md-icon>keyboard_arrow_left</md-icon>
    </md-button>

    <md-button class="md-icon-button md-table-pagination-next" @click="$emit('nextPage')" :disabled="currentPage >= totalPages">
      <md-icon>keyboard_arrow_right</md-icon>
    </md-button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import moderatorapi from '../lib/mediamoderatorAPI'

let data = {
        stateToFilter: 'any',
        perPage: 10,  
}

  export default {
    props: ['statesList', 'pageOptions', 'currentPage', 'totalPages', 'stateFilter', 'mediasPerPage'],

    data() {
      return data
    },

    updated() {
      this.stateToFilter = this.stateFilterComp
      this.perPage = this.mediasPerPage
    },

    computed: {
      stateFilterComp() {
        return (!this.stateFilter || this.stateFilter === '') ? 'any' : this.stateFilter
      }
    }
  }

</script>

<style>

</style>