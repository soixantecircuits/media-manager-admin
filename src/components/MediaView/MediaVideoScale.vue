<template>
  <div class="media-video-scale">
    <div class="current-time">{{ formatDuration(fragmentIn) }}</div>
    <div id="timeline-container">
      <canvas id="timeline"></canvas>
    </div>
  </div>
</template>
<script>
  import duration from '../../lib/duration'
  import timeline from '../../lib/timeline'
  import fragment from '../../lib/fragment'
  import { fabric } from 'fabric'

  export default {
    name: 'media-video-scale',
    mixins: [timeline, fragment],
    props: {
      fragmentIn: {
        type: Number,
        required: true
      },
      fragmentOut: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        canvas: null,
        fragment: null
      }
    },
    watch: {
      fragmentIn () {
        this.updateFragmentSize()
      },
      fragmentOut () {
        this.updateFragmentSize()
      }
    },
    methods: {
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
      },
      formatDuration (value) {
        return duration.toDuration(value)
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
    }

    #timeline-container {
      width: 100%;
      height: 24px;
    }
  }
</style>
