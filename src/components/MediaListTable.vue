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
          <md-table-head></md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(row, rowIndex) in mediasList" :key="rowIndex" :md-item="row">
          <md-table-cell align="left">
            <md-button class="common-button" @click.native="sendEmail(row, rowIndex)">
              <span v-show="!row.sending">Send Email</span>
              <span v-if="row.sending"><dots-spinner></dots-spinner></span>
            </md-button>
          </md-table-cell>
          <md-table-cell align="left" @click.native="details(row)"><span class="highlight">{{ row._id }}</span></md-table-cell>
          <md-table-cell align="left" @click.native="details(row)"><span class="highlight">{{ row.file }}</span></md-table-cell>
          <md-table-cell align="left" @click.native="details(row)">{{ row.uploadedAt }}</md-table-cell>
          <md-table-cell align="left" @click.native="details(row)">
            <div>
              <md-icon class="email-status sent" v-if="emailSent(row)">email</md-icon>
              <md-icon class="email-status" v-else>drafts</md-icon>
              {{ row.meta.email }}
            </div>
          </md-table-cell>
          <md-table-cell align="left" @click.native="details(row)">
            <md-image v-if="row.details && row.details.thumbnail" :md-src="row.details.thumbnail.url" style="max-width:200px; max-height:200px;" width="auto" height="auto"></md-image>
            <md-image v-else :md-src="row.url" style="max-width:200px; max-height:200px;" width="auto" height="auto"></md-image>
          </md-table-cell>
          <md-table-cell align="left">
            <md-input-container class="status-update">
              <md-select v-model="row.state">
                <md-option v-for="state in statesList" :value="state" @selected="$emit('stateChanged', row._id, state)">{{ state }}</md-option>
              </md-select>
            </md-input-container>
          </md-table-cell>
          <md-table-cell>
            <md-button class="md-fab md-clean" @click.native="$emit('deleteMedia', row._id)"><md-icon>delete</md-icon></md-button>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
</template>

<script>
  import moderatorapi from '../lib/mediamanagerAPI'
  import DotsSpinner from './DotsSpinner.vue'

  export default {
    components: {DotsSpinner},
    props: ['mediasList', 'statesList', 'moderatorURL'],
    methods: {
      details(row) {
        if(row) {
          this.$emit('goToDetails', row._id)
        }
      },
      sendEmail (row, rowIndex) {
        this.$emit('stateChanged', row._id, 'public')
        this.mediasList[rowIndex].sending = true
        this.$forceUpdate()

        let vm = this
        setTimeout(() => {
          vm.mediasList[rowIndex].sending = false
          vm.$forceUpdate()
        }, 2500)
      },
      emailSent (row) {
        return row.meta && row.meta.altruistResponse && row.meta.altruistResponse.status === 'sent'
      }
    }
  }
</script>

<style lang="scss">
  .highlight {
    color: #fd4f4f;
    cursor: pointer;
    display: inline-block;
  }
  .email-status {
    color: #e0e0e0;

    &.sent {
      color: #3fb34f;
    }
  }
  .md-table .md-table-cell .md-button.common-button {
    width: auto;
    border: 1px solid #f0f0f0;
  }
</style>
