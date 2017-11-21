<template>
  <div class="media-edit-part-item">
    {{ index }}
  </div>
</template>
<script>
  export default {
    name: 'media-edit-part-item',
    props: {
      index: {
        type: Number,
        required: true
      },
      part: {
        type: Object,
        required: true
      },
    },
    components: {}
  }
</script>
<style lang="scss" scoped>
  .media-edit-part-item {
  }
</style>
