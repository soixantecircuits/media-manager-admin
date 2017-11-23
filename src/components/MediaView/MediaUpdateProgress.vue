<template>
  <div class="media-update-progress" :class="{ 'progress-visible': displayProgressBar }">
    <md-progress :md-progress="progressValue" v-show="displayProgressBar"></md-progress>
    <md-button :disabled="disabled || progressValue > 0" @click.native="updateClick">Update Composition</md-button>
  </div>
</template>
<script>
  export default {
    name: 'media-update-progress',
    computed: {
      displayProgressBar () {
        return this.progressValue > 0
      }
    },
    props: {
      disabled: {
        type: Boolean,
        required: true
      },
      progressValue: {
        type: Number,
        required: true
      }
    },
    methods: {
      updateClick () {
        this.$emit('update-click')
      }
    }
  }
</script>
<style lang="scss">
  .media-update-progress {
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

      &:disabled {
        opacity: 0.5;
      }
    }
  }
</style>
