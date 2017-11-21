<template>
  <div class="media-part-editor" :class="{ disabled: !isEditable, 'not-selected': isEditable && !selectedPart }">
    <div v-if="isEditable">
      <div v-if="hasSelectedPart">
        <div class="editor">
          <div class="title">{{ selectedPart.index }}</div>
          <div class="video-preview">
            <video :src="mediaUrl" muted controls></video>
          </div>
        </div>
        <div class="update-composition">
          <md-progress :md-progress="progressValue"></md-progress>
          <md-button>Update Composition</md-button>
        </div>
      </div>
      <div v-else class="not-selected">&larr; Please, selected a video part for editing.</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'media-part-editor',
    computed: {
      hasSelectedPart () {
        return this.selectedPart && Object.keys(this.selectedPart).length > 0
      }
    },
    props: {
      isEditable: {
        type: Boolean,
        required: true
      },
      mediaUrl: {
        type: String,
        required: true
      },
      selectedPart: {
        type: Object
      }
    },
    data () {
      return {
        progressValue: 10
      }
    }
  }
</script>
<style lang="scss">
  .media-part-editor {
    margin: 10px 10px 10px 0;
    width: 100%;
    min-height: 90%;
    box-sizing: border-box;
    position: relative;

    .editor {
      background: #333;
      border: 1px solid #fd4f4f;
      text-align: left;
      padding-bottom: 20px;

      .video-preview {
        width: 100%;
        overflow: hidden;
      }

      .title {
        background-color: #333;
        padding: 20px 30px;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 16px;
        color: #fff;
      }
    }

    .update-composition {
      margin-top: 10px;
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
