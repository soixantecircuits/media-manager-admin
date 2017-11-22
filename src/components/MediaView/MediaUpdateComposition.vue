<template>
  <div class="media-update-composition">
    <md-progress :md-progress="progressValue"></md-progress>
    <md-button>Update Composition</md-button>
  </div>
</template>
<script>
  export default {
    name: 'media-update-composition',
    props: {
      progressValue: {
        type: Number,
        required: true
      }
    },
    components: {}
  }
</script>
<style lang="scss">
  .media-update-composition {
    background: #333;

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
