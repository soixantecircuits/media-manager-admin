<template>
  <div class="media-info">
    <div class="item">
      <h2 class="media-name"><small>Nom: </small>{{ media.file }}</h2>
    </div>
    <div class="item">
      <md-layout md-row md-sm-columns>
        <md-layout md-column>
          <div>
            <label for="state">State : </label>
            <md-select id="state" name="state" v-model="media.state" @change="setState(media.state)" md-align-trigger>
              <md-option v-for="state in statesList" :value="state">{{ state }}</md-option>
            </md-select>
          </div>
        </md-layout>
        <md-layout md-column>
          <div v-if="bucketsList.length > 0">
            <label for="bucket">Bucket : </label>
            <md-select id="bucket" name="bucket" md-align-trigger>
              <md-option v-for="bucket in bucketsList" :value="bucket.name">{{ bucket.name }}</md-option>
            </md-select>
          </div>
          <div class="no-items" v-else>Bucket : List is Empty</div>
        </md-layout>
      </md-layout>
    </div>
    <div class="item">
      <div class="meta-data">
        <div class="data-row">
          <div class="param">Uploaded at:</div>
          <div class="value">{{ media.uploadedAt }}</div>
        </div>
        <div class="data-row">
          <div class="param">ID:</div>
          <div class="value">{{ media._id }}</div>
        </div>
        <div class="data-row" v-if="media.meta" v-for="(value, key) in media.meta">
          <div class="param">{{ key }}:</div>
          <div class="value">{{ value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'media-info',
    computed: {
      bucketsList() {
        return this.$store.state.bucketsList
      },
      statesList() {
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
      position: relative;
      top: -10px;
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
