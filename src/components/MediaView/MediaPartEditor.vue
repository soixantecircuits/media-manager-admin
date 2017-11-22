<template>
  <div class="media-part-editor" :class="{ disabled: !isEditable, 'not-selected': isEditable && !selectedPart }">
    <div v-if="isEditable">
      <div v-if="hasSelectedPart">
        <div class="editor">
          <div class="title">{{ selectedPart.index }}</div>
          <div class="video-preview">
            <video :src="mediaUrl" muted controls></video>
          </div>
          <div class="controls">
            <div class="left">
              <button>cancel</button>
            </div>
            <div class="right">
              <button>update</button>
            </div>
          </div>
        </div>
        <media-update-composition :progress-value="progressValue"></media-update-composition>
      </div>
      <div v-else class="not-selected">&larr; Please, selected a video part for editing.</div>
    </div>
  </div>
</template>
<script>
  import MediaUpdateComposition from './MediaUpdateComposition.vue'

  export default {
    components: {MediaUpdateComposition},
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

      .video-preview {
        width: 100%;
        overflow: hidden;

        video {
          width: 100%;
        }
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
    .controls {
      display: table;
      width: 100%;

      .left, .right {
        display: table-cell;
        width: 50%;
        padding: 20px;
      }
      .right {
        text-align: right;
      }
      button {
        border: 1px solid #fff;
        font-weight: bold;
        background-color: transparent;
        font-size: 14px;
        text-transform: lowercase;
        border-radius: 30px;
        color: #fff;
        padding: 6px 15px;

        &:active {
          color: #333;
          background: #fff;
        }
      }
    }
    .media-update-composition {
      margin-top: 10px;
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
