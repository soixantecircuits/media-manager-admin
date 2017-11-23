import duration from './duration'

let resizeTimeout = null

export default {
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
    drawHours (size, hms) {
      let step = size.width / hms.hours
      let draw5Minutes = false

      // Draw hours
      this.drawLines(step, size, size.height)

      step = size.width / hms.minutes
      if (step < 10) {
        // Step is too small to be displayed properly on timeline so scale it to 10 minutes
        step = size.width / hms.minutes * 10
        draw5Minutes = true
      }

      // Draw minutes
      this.drawLines(step, size, size.height / 3.3)

      if (draw5Minutes) {
        // Calculate step to draw 5 minutes for better visibility
        step = size.width / hms.minutes * 5

        // Check if five minutes step can be showed on the timeline without looking bad
        if (step >= 10) {
          this.drawLines(step, size, size.height / 6)
        }
      }
    },
    drawMinutes (size, hms) {
      let step = size.width / hms.minutes
      if (step < 10) {
        // Step size is too small to be rendered properly, so scale it to 10 minutes range
        step = size.width / hms.minutes * 10
      }

      // Draw minutes
      this.drawLines(step, size, size.height)

      step = size.width / hms.seconds
      if (step < 10) {
        step = size.width / hms.seconds * 10
        if (step < 5) {
          // Step is too small, step === 0 won't be rendered
          step = 0
        }
      }

      // Draw seconds
      this.drawLines(step, size, size.height / 3.3)
    },
    drawSeconds (size, hms) {
      let step = size.width / hms.seconds
      this.drawLines(step, size, size.height)

      step = size.width / hms.ms
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
      let hms = duration.getHms(totalDuration)

      // Draw time-line
      if (hms.hours > 1) {
        this.drawHours(size, hms)
      } else if (hms.minutes > 1) {
        this.drawMinutes(size, hms)
      } else if (hms.seconds > 1) {
        this.drawSeconds(size, hms)
      } else {
        this.drawMilliseconds(size, totalDuration)
      }

      this.handleWindowResize()
    },
    reRenderCanvas () {
      let vm = this

      if(resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      resizeTimeout = setTimeout(() => {
        // Re-render objects
        let size = vm.getCanvasSize()
        vm.canvas.setWidth(size.width)
        vm.canvas.clear()
        vm.drawObjects()
        console.log('resize')
      }, 500)
    },
    handleWindowResize () {

      window.removeEventListener('resize', this.reRenderCanvas)
      window.addEventListener('resize', this.reRenderCanvas)
    }
  }
}