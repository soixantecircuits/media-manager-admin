<template>
  <div class="media-view-toolbar">
    <md-toolbar md-theme="grey topbar">
      <md-button class="md-primary" @click.native="$emit('back')">Back to list</md-button>
      <div class="flex"></div>
      <div v-if="showNavigation">
        <md-button :disabled="!allowPrevious" @click.native="$emit('previous')">Previous</md-button>
        <md-button :disabled="!allowNext" @click.native="$emit('next')">Next</md-button>
      </div>
      <div class="flex"></div>
      <md-button @click.native="$emit('delete')">Delete this file</md-button>
    </md-toolbar>
  </div>
</template>
<script>
  export default {
    name: 'media-view-toolbar',
    props: {
      allowPrevious: {
        type: Boolean,
        default: false
      },
      allowNext: {
        type: Boolean,
        default: false
      },
      showNavigation: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .media-view-toolbar {
    .flex {
      flex: 1;
    }
  }
</style>
