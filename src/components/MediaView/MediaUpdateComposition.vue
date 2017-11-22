<template>
  <div class="media-update-composition" :class="{ 'progress-visible': displayProgressBar }">
    <md-progress :md-progress="progressValue" v-show="displayProgressBar"></md-progress>
    <md-button @click.native="$emit('update')">Update Composition</md-button>
  </div>
</template>
<script>
  export default {
    name: 'media-update-composition',
    computed: {
      displayProgressBar () {
        return this.progressValue > 0
      }
    },
    props: {
      progressValue: {
        type: Number,
        required: true
      }
    }
  }
</script>
<style lang="scss">
  .media-update-composition {
    background: #333;
    padding-top: 4px;
    padding-bottom: 6px;

    &.progress-visible {
      padding-top: 0;
    }

    .md-theme-default.md-progress {
      background: #014e0c;
    }
    .md-theme-default.md-progress .md-progress-track {
      background: #3fb34f !important;
    }
    .md-button {
      color: #ffffff;
      font-weight: bold;
      font-size: 16px;
      text-transform: lowercase;
    }
  }
</style>
