<template>
  <div class="media-info">
    <div class="item">
      <h2 class="media-name"><small>Nom: </small>{{ media.file }}</h2>
    </div>
    <div class="item">
      <md-layout md-row md-sm-columns>
        <md-layout :md-flex="50">
          <div>
            <label>State : </label>
            <md-select name="state" v-model="media.state" @change="setState(media.state)" md-align-trigger>
              <md-option v-for="state in statesList" :value="state">{{ state }}</md-option>
            </md-select>
          </div>
        </md-layout>
        <md-layout :md-flex="50">
          <div v-if="bucketsList.length > 0">
            <label>Bucket : </label>
            <md-select name="bucket" md-align-trigger>
              <md-option v-for="bucket in bucketsList" :value="bucket.name">{{ bucket.name }}</md-option>
            </md-select>
          </div>
          <div class="no-items" v-else>Bucket : List is Empty</div>
        </md-layout>
      </md-layout>
    </div>
    <div class="item">
      <md-layout md-row>
        <md-layout :md-flex="30">Uploaded at: <span class="value">{{ media.uploadedAt }}</span></md-layout>
        <md-layout :md-flex="30">ID: <span class="value">{{ media._id }}</span></md-layout>
        <md-layout :md-flex="15">From: <span class="value">{{ etnaFrom }}</span></md-layout>
        <md-layout :md-flex="15">To: <span class="value">{{ etnaTo }}</span></md-layout>
        <md-layout :md-flex="10" v-if="mediaPreviewShowDebugInfo"><a href="#" @click.prevent="expandDebugInfo=!expandDebugInfo">Debug</a></md-layout>
      </md-layout>
    </div>
    <div class="item" v-if="mediaPreviewShowDebugInfo && expandDebugInfo">
      <md-layout md-row v-if="media.meta" v-for="(value, key) in media.meta">
        <md-layout :md-flex="25">{{ key }}:</md-layout>
        <md-layout :md-flex="75">{{ value }}</md-layout>
      </md-layout>
    </div>
  </div>
</template>
<script>
  import settings from '../../lib/settings'

  export default {
    mixins: [ settings ],
    name: 'media-info',
    computed: {
      etnaFrom () {
        if(this.media.meta && this.media.meta.etnaInput && this.media.meta.etnaInput._from) {
          return this.media.meta.etnaInput._from
        }

        return 'N/A'
      },
      etnaTo () {
        if(this.media.meta && this.media.meta.etnaInput && this.media.meta.etnaInput._to) {
          return this.media.meta.etnaInput._to
        }

        return 'N/A'
      },
      mediaPreviewShowDebugInfo () {
        return this.getSettings().mediaPreviewShowDebugInfo
      },
      bucketsList () {
        return this.$store.state.bucketsList
      },
      statesList () {
        return this.$store.state.statesList
      }
    },
    methods: {
      setState (state) {
        this.$emit('stateChanged', state)
      }
    },
    props: {
      media: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        expandDebugInfo: false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .media-info {
    background: #fff;

    .item {
      display: block;
      border-bottom: 1px solid #ccc;
      padding: 19px 30px;

      span.value {
        display: block;
        width: 100%;
        font-weight: bold;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-right: 5px;
      }
    }
    .item:last-child {
      border-bottom: none;
    }

    .media-name {
      line-height: 100%;
      font-size: 20px;
      font-weight: bold;
      color: #ff5858;
      padding: 0;
      margin: 0;

      small {
        display: block;
        font-size: 16px;
        font-weight: normal;
        color: #333;
      }
    }

    label {
      display: inline-block;
      padding-right: 5px;
      z-index: 1;
      top: -10px;
      position: relative;
    }
    label + .md-select {
      width: 200px;
      display: inline-block;
      font-weight: bold;
    }

    .no-items {
      font-style: italic;
      color: #aaaaaa;
      display: inline-block;
      position: relative;
    }
    label + .no-items {
      width: 200px;
    }
    .meta-data {
      display: table;
      width: 100%;
      .data-row {
        display: table-row;
        &:hover {
          .param, .value {
            background-color: #f0f0f0;
          }
        }
      }
      .param, .value {
        display: table-cell;
        vertical-align: top;
        padding: 7px 0;
      }
      .param {
        width: 25%;
      }
      .value {
        width: 75%;
        font-weight: bold;
      }
    }
  }
</style>
