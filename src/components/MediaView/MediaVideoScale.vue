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
  import { fabric } from 'fabric'

  export default {
    name: 'media-video-scale',
    mixins: [timeline],
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
      getFragmentSizeAndPosition () {
        const fragmentHeight = 8
        const fragmentMinWidth = 16

        let size = this.getCanvasSize()
        let fragmentDuration = this.fragmentOut - this.fragmentIn
        let width = (fragmentDuration * 100 / this.total) * size.width / 100
        let left = (this.fragmentIn * 100 / this.total) * size.width / 100

        if (fragmentDuration <= 0) {
          fragmentDuration = 1
        }

        return {
          left: left,
          top: size.height - fragmentHeight,
          width: width < fragmentMinWidth ? fragmentMinWidth : width,
          height: fragmentHeight
        }
      },
      updateFragmentSize () {
        let fragmentSize = this.getFragmentSizeAndPosition()

        this.fragment.set('left', fragmentSize.left)
        this.fragment.set('width', fragmentSize.width).setCoords()
        this.canvas.requestRenderAll()
      },
      drawFragment () {
        let fragmentSize = this.getFragmentSizeAndPosition()
        this.fragment = new fabric.Rect({
          fill: '#fd4f4f',
          left: fragmentSize.left,
          top: fragmentSize.top,
          width: fragmentSize.width,
          height: fragmentSize.height,
          selectable: true,
          hasBorders: false,
          hasControls: false,
          lockMovementY: true
        })

        this.canvas.add(this.fragment)
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
