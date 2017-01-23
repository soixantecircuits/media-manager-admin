<template v-for="(item, index) in filesList">
  <tr  v-if="index >= (nbFilesToDisplay * currentListPage) && index < ((nbFilesToDisplay * currentListPage) + nbFilesToDisplay)"
    v-bind:class="[ 'mylist-line', index % 2 == 0 ? 'mylist-line-alt' : '' ]">
    <td class="delete-field"><button v-on:click="deleteItem(item._id)">Delete</button></td>
    <td>
      <a v-bind:href="`${moderatorURL}/${item._id}`" target="_blank"><img v-bind:src="`${moderatorURL}/${item._id}`" width="200" height="200"></a>
    </td>
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
    computed: {
      moderatorURL() {
        return `http://${config.moderatorServer}${config.apiRoute}`
      },
      nbFilesToDisplay() {
        return this.$store.state.nbFilesToDisplay
      },
      currentListPage() {
        return this.$store.state.currentListPage
      },
      filesList() {
        return this.$store.state.filesList
      },
      states() {
        return this.$store.state.states
      }
    }


  }
</script>

<style>
</style>