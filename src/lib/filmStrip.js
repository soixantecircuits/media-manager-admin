import { fabric } from 'fabric'

export default {
  props: {
    videoSelector: {
      type: String,
      required: true
    },
    totalFrames: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      video: null,
      frame: 0,
      frameWidth: 125,
      frameHeight: 75,
      stripCanvas: null
    }
  },
  methods: {
    rewindVideo () {
      this.video.currentTime = this.fgIn / 1000
    },
    drawStrip () {
      this.video.removeEventListener('canplaythrough', this.drawStrip)

      const x = this.frameWidth * this.frame
      const w = this.video.videoWidth
      const h = this.video.videoHeight

      this.stripCanvas.drawImage(this.video, 0, 0, w, h, x, 28, this.frameWidth, this.frameHeight)

      this.frame = this.frame + 1
      if (this.frame < this.totalFrames) {
        this.video.addEventListener('canplaythrough', this.drawStrip)
        this.video.currentTime = (this.frame * (this.video.duration / this.totalFrames))
      } else {
        this.video.currentTime = 0
      }
    },
    initFilmStrip () {
      let video = document.querySelector(this.videoSelector)
      let stripCanvas = document.querySelector('#strip')

      if(!video) {
        console.error('<video> cannot be found by given selector: ', this.videoSelector)
      } else {
        let size = this.getCanvasSize()
        this.stripCanvas = stripCanvas.getContext('2d')
        stripCanvas.width = size.width
        stripCanvas.height = size.height

        this.video = video
        this.video.addEventListener('canplaythrough', this.drawStrip)
      }

      this.frame = 0
    }
  }
}