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
      frameHeight: 75
    }
  },
  methods: {
    drawStrip () {
      this.video.removeEventListener('canplaythrough', this.drawStrip)

      const x = this.frameWidth * this.frame
      const w = this.video.videoWidth
      const h = this.video.videoHeight

      let properties = {
        left: x,
        top: 28,
        width: w,
        height: h,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: 'left',
        originY: 'top',
        scaleX: this.frameWidth / w,
        scaleY: this.frameHeight / h
      }

      let frameImg = new fabric.Image(this.video, properties)

      this.canvas.add(frameImg)
      this.caret.bringToFront()
      this.canvas.renderAll()

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
      if(!video) {
        console.error('<video> cannot be found by given selector: ', this.videoSelector)
      } else {
        this.video = video
        this.video.addEventListener('canplaythrough', this.drawStrip)
      }

      this.frame = 0
    }
  }
}