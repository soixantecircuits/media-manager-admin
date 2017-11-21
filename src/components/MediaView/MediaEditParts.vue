<template>
  <div class="media-edit-parts" :class="{ disabled: !hasEditableParts }">
    <div class="title">Edit Part</div>
    <div class="list">
      <div class="empty-list" v-if="!hasEditableParts">
        This video doesn't contain any editable parts.
      </div>
    </div>
  </div>
</template>
<script>
  import mediaEditor from '../../lib/mediaEditor'

  export default {
    name: 'media-edit-parts',
    mixins: [ mediaEditor ],
    props: {
      media: {
        type: Object,
        required: true
      }
    },
    mounted () {
      this.initMediaEditor()
    }
  }
</script>
<style lang="scss" scoped>
  .media-edit-parts {
    margin-top: 10px;

    .title {
      background-color: #333;
      padding: 20px 30px;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 16px;
      color: #fff;
    }
    .list {
      border-top: 1px solid #000;
      background-color: #1e1e1e;
      color: #d1d1d1;
      width: 100%;
      box-sizing: border-box;
      max-height: 300px;
      overflow: hidden;
      overflow-y: auto;

      .empty-list {
        text-align: center;
        padding: 120px 30px;
        font-weight: 300;
        font-size: 22px;
        color: #ccc;
      }
    }
    &.disabled {
      opacity: 0.5;

      .title {
        opacity: 0.7;
      }
    }
  }
</style>
