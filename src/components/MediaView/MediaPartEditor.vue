<template>
  <div class="media-part-editor" :class="{ disabled: !isEditable, 'not-selected': isEditable && !selectedPart }">
    <div v-if="isEditable">
      <div v-if="hasSelectedPart">
        <div class="editor">
          <div class="title">{{ selectedPart.index }}</div>

          <!-- Video Preview -->
          <div class="video-preview">
            <video :src="mediaUrl" id="video" controls></video>
          </div>

          <!-- Timeline -->
          <media-video-scale :fragment-in="fragmentIn" :fragment-out="fragmentOut" :total="totalMilliseconds" @change="fragmentChange"></media-video-scale>

          <!-- Timeline with video preview -->
          <media-video-fragment :video-selector="'#video'" :fragment-in="fragmentIn" :fragment-out="fragmentOut" :total="totalMilliseconds" @change="fragmentChange"></media-video-fragment>

          <!-- OK / Cancel Controls -->
          <div class="controls">
            <div class="left"><button :disabled="!fragmentChanged" @click="cancelEdits">cancel</button></div>
            <div class="right"> <button @click="nextPart">next</button></div>
          </div>
        </div>

        <!-- Render composition progress & button -->
        <media-render :progress-value="progressValue" @update-click="updateComposition"></media-render>
      </div>
      <div v-else class="not-selected">&larr; Please, selected a video part for editing.</div>
    </div>
  </div>
</template>
<script>
  import MediaRender from './MediaRender'
  import MediaVideoScale from './MediaVideoScale.vue'
  import MediaVideoFragment from './MediaVideoFragment.vue'
  import duration from '../../lib/duration'
  import compositionRenderer from '../../lib/compositionRenderer'
  import settings from '../../lib/settings'

  export default {
    components: {
      MediaVideoFragment,
      MediaVideoScale,
      MediaRender
    },
    name: 'media-part-editor',
    mixins: [compositionRenderer, settings],
    computed: {
      hasSelectedPart () {
        return this.selectedPart && Object.keys(this.selectedPart).length > 0
      },
      fragmentChanged () {
        return this.initFragmentIn !== this.fragmentIn || this.initFragmentOut !== this.fragmentOut
      },
      totalMilliseconds () {
        return this.totalSeconds * 1000
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
      parts: {
        type: Array,
        required: true
      },
      selectedPart: {
        type: Object
      },
      totalSeconds: {
        type: Number,
        required: true
      }
    },
    watch: {
      selectedPart (part) {
        let start = duration.toMilliseconds(part.in)
        let end = duration.toMilliseconds(part.out)

        this.fragmentIn = start
        this.fragmentOut = end
        this.initFragmentIn = start
        this.initFragmentOut = end
      }
    },
    methods: {
      playFragment(part) {
        if(!part) {
          return
        }

        let start = duration.toMilliseconds(part.in) / 1000
        let end = duration.toMilliseconds(part.out) / 1000

        let video = document.querySelector('#video')
        if(!video) {
          return
        }

        let vm = this

        if(vm.playFragmentInterval) {
          clearInterval(vm.playFragmentInterval)
        }

        // Play fragment
        video.currentTime = start
        video.play()
        vm.playFragmentInterval = setInterval(() => {
          if(video.currentTime >= end) {
            video.pause()
            clearInterval(vm.playFragmentInterval)
            vm.playFragmentInterval = null
          }
        }, 100)
      },
      nextPart () {
        this.$emit('next')
      },
      cancelEdits () {
        this.fragmentOut = this.initFragmentOut
        this.fragmentIn = this.initFragmentIn
      },
      fragmentChange (newIn, newOut) {
        this.fragmentIn = newIn
        this.fragmentOut = newOut

        this.$emit('update', this.fragmentIn, this.fragmentOut)
      }
    },
    data () {
      return {
        fragmentIn: 0,
        fragmentOut: 0,
        initFragmentIn: 0,
        initFragmentOut: 0,
        playFragmentInterval: null
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
    color: #fff;

    .editor {
      background: #333;
      border: 1px solid #fd4f4f;
      text-align: left;

      .video-preview {
        width: 100%;
        overflow: hidden;
        position: relative;

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
      position: relative;
      z-index: 100;

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
        text-align: center;
        min-width: 120px;

        &:disabled {
          opacity: 0.5;
        }
        &:active {
          color: #333;
          background: #fff;
        }
      }
    }
    .media-update-progress {
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
