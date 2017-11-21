<template>
  <div class="media-part-editor" :class="{ disabled: !isEditable, 'not-selected': isEditable && !selectedPart }">
    <div v-if="isEditable">
      <div v-if="!selectedPart" class="not-selected">&larr; Please, selected a video part for editing.</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'media-part-editor',
    props: {
      isEditable: {
        type: Boolean,
        required: true
      },
      selectedPart: {
        type: Object
      }
    }
  }
</script>
<style lang="scss" scoped>
  .media-part-editor {
    margin: 10px 10px 10px 0;
    width: 100%;
    min-height: 90%;
    box-sizing: border-box;
    position: relative;
    
    &.disabled {
      background: #111 repeating-linear-gradient(45deg, #141414, #141414 3px, #111 3px, #111 10px);
    }
    &.not-selected {
      background: #111;
    }

    .not-selected {
      font-weight: 300;
      color: #aaa;
      font-size: 22px;
      position: absolute;
      bottom: 270px;
      left: 0;
      width: 100%;
    }
  }
</style>
