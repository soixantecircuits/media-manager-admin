<template>
  <div class="md-table-pagination">
    <span class="md-table-pagination-label">Filter by state :</span>
    <md-select v-if="statesList" v-model="stateFilter" md-menu-class="md-pagination-select">
      <md-option value="any" @selected="$emit('stateFilterChanged', 'any')">Any</md-option>
      <md-option v-for="state in statesList" :value="state" @selected="$emit('stateFilterChanged', state)">{{ state }}</md-option>
    </md-select>

    <span class="md-table-pagination-label">Files per page :</span>
    <md-select v-if="pageOptions" v-model="mediasPerPage" md-menu-class="md-pagination-select">
      <md-option v-for="amount in pageOptions" :value="amount" @selected="$emit('mediasPerPageChanged', mediasPerPage)">{{ amount }}</md-option>
    </md-select>

    <span class="md-table-pagination-label" style="margin-right:32px;">{{ totalMedia }} Media found</span>

    <span>Page {{ Number.isNaN(currentPage) ? '-' : currentPage }} of {{ Number.isNaN(totalPages) ? '-' : totalPages }}</span>

    <md-button class="md-icon-button md-table-pagination-previous" @click.native="$emit('previousPage')" :disabled="currentPage === 1">
      <md-icon>keyboard_arrow_left</md-icon>
    </md-button>

    <md-button class="md-icon-button md-table-pagination-next" @click.native="$emit('nextPage')" :disabled="currentPage >= totalPages">
      <md-icon>keyboard_arrow_right</md-icon>
    </md-button>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueMaterial from 'vue-material'
  import 'vue-material/dist/vue-material.css'
  import moderatorapi from '../lib/mediamanagerAPI'

  export default {
    props: ['statesList', 'pageOptions', 'currentPage', 'totalPages'],

    computed: {
      stateFilter: {
        get () {
          return this.$store.state.stateFilter
        },
        set (value) {
          this.$store.commit('setStateFilter', value)
        }
      },
      mediasPerPage: {
        get () {
          return this.$store.state.mediasPerPage
        },
        set (value) {
          this.$store.commit('setMediasPerPage', value)
        }
      },
      totalMedia () {
        return this.$store.state.totalMedias
      }
    }
  }

</script>

<style>
</style>