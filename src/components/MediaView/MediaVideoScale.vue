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
  import { fabric } from 'fabric'

  export default {
    name: 'media-video-scale',
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
        canvas: null
      }
    },
    methods: {
      drawLines (step, size, lineHeight) {
        if (!step) {
          return
        }

        for (let x = 0; x <= size.width; x += step) {
          let line = new fabric.Line([x, size.height, x, size.height - lineHeight], {
            stroke: 'white',
            strokeWidth: 1,
            hasControls: false,
            selectable: false,
            hasRotatingPoint: false
          })

          this.canvas.add(line)
        }
      },
      drawHours (size, hours, minutes) {
        let step = size.width / hours
        let draw5Minutes = false

        // Draw hours
        this.drawLines(step, size, size.height)

        step = size.width / minutes
        if (step < 10) {
          // Step is too small to be displayed properly on timeline so scale it to 10 minutes
          step = size.width / minutes * 10
          draw5Minutes = true
        }

        // Draw minutes
        this.drawLines(step, size, size.height / 3.3)

        if (draw5Minutes) {
          // Calculate step to draw 5 minutes for better visibility
          step = size.width / minutes * 5

          // Check if five minutes step can be showed on the timeline without looking bad
          if (step >= 10) {
            this.drawLines(step, size, size.height / 6)
          }
        }
      },
      drawMinutes (size, minutes, seconds) {
        let step = size.width / minutes
        if (step < 10) {
          // Step size is too small to be rendered properly, so scale it to 10 minutes range
          step = size.width / minutes * 10
        }

        // Draw minutes
        this.drawLines(step, size, size.height)

        step = size.width / seconds
        if (step < 10) {
          step = size.width / seconds * 10
          if (step < 10) {
            // Step is too small, step === 0 won't be rendered
            step = 0
          }
        }

        // Draw seconds
        this.drawLines(step, size, size.height / 3.3)
      },
      drawSeconds (size, seconds, milliseconds) {
        let step = size.width / seconds
        this.drawLines(step, size, size.height)

        step = size.width / milliseconds
        if (!step) {
          return
        }

        while (step < 10) {
          step = step * 10
        }

        this.drawLines(step, size, size.height / 3.3)
      },
      drawMilliseconds (size, milliseconds) {
        let step = size.width / milliseconds
        if (!step) {
          return
        }

        while (step < 10) {
          step = step * 10
        }

        this.drawLines(step, size, size.height)
      },
      drawTimeLine () {
        let totalDuration = this.total
        let size = this.getCanvasSize()

        // Draw timeline
        let hours = duration.getHours(totalDuration)
        let minutes = duration.getMinutes(totalDuration)
        let seconds = duration.getSeconds(totalDuration)

        if (hours > 1) {
          this.drawHours(size, hours, minutes)
        } else if (minutes > 1) {
          this.drawMinutes(size, minutes, seconds)
        } else if (seconds > 1) {
          this.drawSeconds(size, seconds, totalDuration)
        } else {
          this.drawMilliseconds(size, totalDuration)
        }
      },
      getCanvasSize () {
        let canvasContainer = document.getElementById('timeline-container')
        return {
          width: canvasContainer.offsetWidth,
          height: canvasContainer.offsetHeight
        }
      },
      drawFragment () {
        let size = this.getCanvasSize()
        let fragmentHeight = 8
        let fragment = new fabric.Rect({
          fill: '#fd4f4f', left: 0, top: size.height - fragmentHeight, width: 100, height: fragmentHeight
        })

        fragment.selectable = true
        fragment.hasBorders = false
        fragment.hasControls = false
        fragment.lockMovementY = true

        this.canvas.add(fragment)
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
