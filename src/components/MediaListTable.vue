<template>
    <md-table v-show="mediasList.length > 0">
      <md-table-header>
        <md-table-row>
          <md-table-head>Delete</md-table-head>
          <md-table-head>ID</md-table-head>
          <md-table-head>Filename</md-table-head>
          <md-table-head>Created at</md-table-head>
          <md-table-head>Email Address</md-table-head>
          <md-table-head>Media</md-table-head>
          <md-table-head>State</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(row, rowIndex) in mediasList" :key="rowIndex" :md-item="row">
          <md-table-cell>
            <md-button class="md-fab md-clean" @click.native="$emit('deleteMedia', row._id)"><md-icon>delete</md-icon></md-button>
          </md-table-cell>
          <md-table-cell align="left"><a @click="$emit('goToDetails', row._id)" style="cursor: pointer;">{{ row._id }}</a></md-table-cell>
          <md-table-cell align="left"><a @click="$emit('goToDetails', row._id)" style="cursor: pointer;">{{ row.file }}</a></md-table-cell>
          <md-table-cell align="left">{{ row.uploadedAt }}</md-table-cell>
          <md-table-cell align="left">{{ row.meta.email }}</md-table-cell>
          <md-table-cell align="left">
            <a @click="$emit('goToDetails', row._id)" style="cursor: pointer;">
              <md-image v-if="row.details && row.details.thumbnail" :md-src="row.details.thumbnail.url" style="max-width:200px; max-height:200px;" width="auto" height="auto"></md-image>
              <md-image v-else :md-src="row.url" style="max-width:200px; max-height:200px;" width="auto" height="auto"></md-image>
            </a>
          </md-table-cell>
          <md-table-cell align="left">
            <md-input-container class="status-update">
              <md-select v-model="row.state">
                <md-option v-for="state in statesList" :value="state" @selected="$emit('stateChanged', row._id, state)">{{ state }}</md-option>
              </md-select>
            </md-input-container>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
</template>

<script>
  import moderatorapi from '../lib/mediamanagerAPI'

  export default {
    props: ['mediasList', 'statesList', 'moderatorURL'],
  }
</script>

<style></style>