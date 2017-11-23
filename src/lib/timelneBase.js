import duration from './duration'

export default {
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
  watch: {
    fragmentIn () {
      this.fgIn = this.fragmentIn
      this.timeUpdated(true)
    },
    fragmentOut () {
      this.fgOut = this.fragmentOut
      this.timeUpdated(true)
    }
  },
  data () {
    return {
      fgIn: 0,
      fgOut: 0,
      resizeTimeout: null
    }
  },
  computed: {
    formattedIn () {
      return this.formatDuration(this.fgIn)
    },
    formattedOut () {
      return this.formatDuration(this.fgOut)
    },
    fragmentDuration () {
      return this.fgOut - this.fgIn
    },
  },
  methods: {
    reRenderCanvas () {
      let vm = this

      if(this.resizeTimeout) {
        clearTimeout(this.resizeTimeout)
      }

      this.resizeTimeout = setTimeout(() => {
        // Re-render objects
        let size = vm.getCanvasSize()
        vm.canvas.setWidth(size.width)
        vm.canvas.clear()
        vm.drawObjects()
      }, 500)
    },
    handleWindowResize () {
      window.removeEventListener('resize', this.reRenderCanvas)
      window.addEventListener('resize', this.reRenderCanvas)
    },
    movingObject (ev) {
      let target = ev.target

      // Check bounds
      target.setCoords()

      if (target.getBoundingRect().left < 0) {
        target.left = Math.max(target.left, target.left - target.getBoundingRect().left)
      }

      if (target.getBoundingRect().left > target.canvas.width) {
        target.left = Math.min(target.left, target.canvas.width - target.getBoundingRect().width + target.left - target.getBoundingRect().left)
      }      

      let pos = target.get('left')
      let size = this.getCanvasSize()

      let newIn = Math.round((pos * 100 / size.width) * this.total / 100)
      let delta = this.fragmentDuration

      this.fgIn = newIn
      this.fgOut = newIn + delta
      this.timeUpdated()
    },
    timeUpdated (silent) {
      this.updateFragmentSize()

      if (!silent) {
        this.$emit('change', this.fgIn, this.fgOut)
      }
    },
    formatDuration (value) {
      return duration.toDuration(value)
    }
  },
  mounted () {
    this.fgIn = this.fragmentIn
    this.fgOut = this.fragmentOut
  }
}