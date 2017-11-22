export default {
  methods: {
    getFragmentSizeAndPosition () {
      const fragmentHeight = 8
      const fragmentMinWidth = 16

      let size = this.getCanvasSize()
      let fragmentDuration = this.fgOut - this.fgIn
      let width = (fragmentDuration * 100 / this.total) * size.width / 100
      let left = (this.fgIn * 100 / this.total) * size.width / 100

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
      this.canvas.on('object:moving', this.movingObject)
    }
  }
}