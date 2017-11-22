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
  import fabric from 'fabric'

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
    methods: {
      drawLines (ctx, step, size, lineHeight) {
        if (!step) {
          return
        }

        ctx.scale(1, 1)
        for (let x = 0; x <= size.width; x += step) {
          ctx.beginPath()
          ctx.lineWidth = 1
          ctx.strokeStyle = 'white'
          ctx.moveTo(x, size.height)
          ctx.lineTo(x, size.height - lineHeight)
          ctx.closePath()
          ctx.stroke()
        }
      },
      drawHours (ctx, size, hours, minutes) {
        let step = size.width / hours
        let draw5Minutes = false

        // Draw hours
        this.drawLines(ctx, step, size, size.height)

        step = size.width / minutes
        if (step < 10) {
          // Step is too small to be displayed properly on timeline so scale it to 10 minutes
          step = size.width / minutes * 10
          draw5Minutes = true
        }

        // Draw minutes
        this.drawLines(ctx, step, size, size.height / 2)

        if (draw5Minutes) {
          // Calculate step to draw 5 minutes for better visibility
          step = size.width / minutes * 5

          // Check if five minutes step can be showed on the timeline without looking bad
          if (step >= 10) {
            this.drawLines(ctx, step, size, size.height / 3)
          }
        }
      },
      drawMinutes (ctx, size, minutes, seconds) {
        let step = size.width / minutes
        if (step < 10) {
          // Step size is too small to be rendered properly, so scale it to 10 minutes range
          step = size.width / minutes * 10
        }

        // Draw minutes
        this.drawLines(ctx, step, size, size.height)

        step = size.width / seconds
        if (step < 10) {
          step = size.width / seconds * 10
          if (step < 10) {
            // Step is too small, step === 0 won't be rendered
            step = 0
          }
        }

        // Draw seconds
        this.drawLines(ctx, step, size, size.height / 2)
      },
      drawSeconds (ctx, size, seconds) {
        let step = size.width / seconds
        this.drawLines(ctx, step, size, size.height)
      },
      drawMilliseconds (ctx, size, milliseconds) {
        let step = size.width / milliseconds
        if(!step) {
          return
        }

        while (step < 10) {
          step = step * 10
        }

         this.drawLines(ctx, step, size, size.height)
      },
      drawTimeLine () {
        let canvasContainer = document.getElementById('timeline-container')
        let canvas = document.getElementById('timeline')
        let ctx = canvas.getContext('2d')
        let totalDuration = this.total
        let size = {
          width: canvasContainer.offsetWidth,
          height: canvasContainer.offsetHeight
        }

        ctx.canvas.width = size.width
        ctx.canvas.height = size.height

        // Draw timeline
        let hours = duration.getHours(totalDuration)
        let minutes = duration.getMinutes(totalDuration)
        let seconds = duration.getSeconds(totalDuration)

        if (hours > 1) {
          this.drawHours(ctx, size, hours, minutes)
        } else if (minutes > 1) {
          this.drawMinutes(ctx, size, minutes, seconds)
        } else if (seconds > 1) {
          this.drawSeconds(ctx, size, seconds)
        } else {
          this.drawMilliseconds(ctx, size, totalDuration)
        }
      },
      formatDuration (value) {
        return duration.toDuration(value)
      }
    },
    mounted () {
      this.drawTimeLine()

      let vm = this
      window.onresize = () => {
        vm.drawTimeLine()
      }
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
