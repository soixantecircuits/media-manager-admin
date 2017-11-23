<template>
  <div class="media-render" :class="{ 'progress-visible': displayProgressBar }">
    <md-progress :md-progress="progressValue"></md-progress>
    <md-button :disabled="disabled || progressValue > 0" @click.native="updateClick">Render composition</md-button>
  </div>
</template>
<script>
  export default {
    name: 'media-render',
    computed: {
      displayProgressBar () {
        return this.progressValue > 0
      }
    },
    props: {
      disabled: {
        type: Boolean,
        default: false,
        required: false
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
  .media-render {
    background: #333;
    padding-top: 4px;
    padding-bottom: 6px;
    padding-top: 0;
    width: 100%;
    margin-right: 10px;

    .md-theme-default.md-progress {
      background: transparent;
    }

    &.progress-visible {
      .md-theme-default.md-progress {
        background: #014e0c;
      }
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
