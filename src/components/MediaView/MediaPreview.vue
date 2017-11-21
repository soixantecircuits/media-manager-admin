<template>
  <div class="media-preview">
    <div class="preview">
      <video v-if="media.type && media.type.search('video') !== -1" :src="media.url" muted autoplay controls></video>
      <md-image v-else :md-src="media.url" alt="Media"></md-image>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'media-preview',
    props: {
      media: {
        type: Object,
        required: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .media-preview {
    .preview {
      background: #1a1a1a;
      text-align: center;

      video, .md-image {
        margin: auto;
        max-height: 300px;
      }
    }
  }
</style>
