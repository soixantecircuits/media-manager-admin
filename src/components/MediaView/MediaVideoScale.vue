<template>
  <div class="media-video-scale">
    <div class="current-time">
      <input type="text" v-model="formattedIn" id="current-time-input" @keyup.up="increaseTime" @keyup.down="decreaseTime" @keyup.enter="inputTime">
      <span class="hint">(press Enter to apply, &uarr; &darr; to increment / decrement)</span>
    </div>
    <div id="timeline-container">
      <canvas id="timeline"></canvas>
    </div>
  </div>
</template>
<script>
  import duration from '../../lib/duration'
  import timeline from '../../lib/timeline'
  import fragment from '../../lib/fragment'
  import timelineBase from '../../lib/timelneBase'
  import { fabric } from 'fabric'

  export default {
    name: 'media-video-scale',
    mixins: [timeline, fragment, timelineBase],
    data () {
      return {
        canvas: null,
        fragment: null
      }
    },
    methods: {
      inputTime () {
        let val = document.getElementById('current-time-input').value
        let delta = this.fragmentDuration
        let ms = duration.toMilliseconds(val)

        this.fgIn = ms
        this.fgOut = ms + delta
        this.timeUpdated()
      },
      increaseTime () {
        let incVal = this.getIncrementalValue()
        this.fgIn += incVal
        this.fgOut += incVal
        this.timeUpdated()
      },
      decreaseTime () {
        let incVal = this.getIncrementalValue()
        this.fgIn -= incVal
        this.fgOut -= incVal
        this.timeUpdated()
      },
      getIncrementalValue () {
        let hms = duration.getHms(this.total)
        if (hms.hours > 0 || hms.minutes > 0 || hms.seconds > 1) {
          return 1000
        }

        return 100
      },
      getCanvasSize () {
        let canvasContainer = document.getElementById('timeline-container')
        return {
          width: canvasContainer.offsetWidth,
          height: canvasContainer.offsetHeight
        }
      },
      drawObjects () {
        this.drawFragment()
        this.drawTimeLine()
      },
      initCanvas () {
        this.canvas = new fabric.Canvas('timeline')
        this.canvas.preserveObjectStacking = true
        this.canvas.selection = false
        let size = this.getCanvasSize()
        this.canvas.setWidth(size.width)
        this.canvas.setHeight(size.height)
      }
    },
    mounted () {
      this.initCanvas()
      this.drawObjects()
    }
  }
</script>
<style lang="scss" scoped>
  .media-video-scale {
    padding: 30px;

    .current-time {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
      position: relative;

      input {
        background-color: transparent;
        color: #fff;
        border: none;
        outline: none;
        font-size: 16px;
        padding: 0;
        font-weight: bold;

        &:focus {
          border-bottom: 1px solid #fd4f4f;
        }
      }
      .hint {
        font-size: 12px;
        font-weight: normal;
        position: absolute;
        top: 0px;
        padding-left: 10px;
        color: #888;
        display: none;
      }
      input:focus + .hint {
        display: inline-block;
      }
    }

    #timeline-container {
      width: 100%;
      height: 24px;
    }
  }
</style>
