<template>
  <div class="media-video-fragment">
    <div class="timeline-container">
      <div class="fragment-duration">
        <div class="start">
          start : <span class="value">{{ formattedIn }}</span>
        </div>
        <div class="end">
          end : <span class="value">{{ formattedOut }}</span>
        </div>
      </div>
      <div id="preview-container">
        <canvas id="preview"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
  import timelineBase from '../../lib/timelneBase'
  import { fabric } from 'fabric'

  export default {
    name: 'media-video-fragment',
    mixins: [timelineBase],
    data () {
      return {
        canvas: null,
        caret: null
      }
    },
    methods: {
      getFragmentSizeAndPosition () {
        const minWidth = 50
        const headerHeight = 28
        const frameWidth = 4

        let fragmentDuration = this.fgOut - this.fgIn
        let size = this.getCanvasSize()
        let left = (this.fgIn * 100 / this.total) * size.width / 100
        let width = (fragmentDuration * 100 / this.total) * size.width / 100
        let height = size.height

        if (width < minWidth) {
          width = minWidth
        }

        return {
          minWidth: minWidth,
          headerHeight: headerHeight,
          frameWidth: frameWidth,
          left: left,
          width: width,
          height: height
        }
      },
      updateFragmentSize () {
        let caretSize = this.getFragmentSizeAndPosition()

        this.caret.set('left', caretSize.left)
        this.canvas.requestRenderAll()
      },
      getCanvasSize () {
        let canvasContainer = document.getElementById('preview-container')
        return {
          width: canvasContainer.offsetWidth,
          height: canvasContainer.offsetHeight
        }
      },
      initCanvas () {
        let size = this.getCanvasSize()

        this.canvas = new fabric.Canvas('preview')
        this.canvas.preserveObjectStacking = false
        this.canvas.selection = false
        this.canvas.setWidth(size.width)
        this.canvas.setHeight(size.height)

        this.canvas.on('object:moving', this.movingObject)
      },
      drawObjects () {
        this.drawCaret()
      },
      drawCaret () {
        let caretSize = this.getFragmentSizeAndPosition()
        let header = new fabric.Rect({left: 0, top: 0, width: caretSize.width, height: caretSize.headerHeight, fill: '#fd4f4f'})
        let leftFrame = new fabric.Rect({
          left: 0,
          top: caretSize.headerHeight,
          width: caretSize.frameWidth,
          height: caretSize.height - caretSize.headerHeight,
          fill: '#fd4f4f'
        })
        let rightFrame = new fabric.Rect({
          left: caretSize.width - caretSize.frameWidth,
          top: caretSize.headerHeight,
          width: caretSize.frameWidth,
          height: caretSize.height - caretSize.headerHeight,
          fill: '#fd4f4f'
        })
        let bottomFrame = new fabric.Rect({
          left: 0,
          top: caretSize.height - caretSize.frameWidth,
          width: caretSize.width,
          height: caretSize.frameWidth,
          fill: '#fd4f4f'
        })

        let group = new fabric.Group([header, leftFrame, rightFrame, bottomFrame], {
          left: caretSize.left,
          top: 0,
          selectable: true,
          hasBorders: false,
          hasControls: false,
          lockMovementY: true
        })

        this.canvas.add(group)
        this.caret = group
      }
    },
    mounted () {
      this.initCanvas()
      this.drawObjects()
    }
  }
</script>
<style lang="scss" scoped>
  .media-video-fragment {
    padding-bottom: 30px;
    .timeline-container {
      position: relative;
      padding: 0 28px;
    }
    .fragment-duration {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 10px;
      z-index: 2;
      font-size: 14px;

      .start, .end {
        position: absolute;
        top: 0;

        .value {
          display: inline-block;
          padding: 4px 6px;
          font-weight: bold;
          line-height: 100%;
          background: #1a1a1a;
          color: #fd4f4f;
        }
      }
      .start {
        left: 28px;
      }
      .end {
        right: 28px;
      }
    }
    #preview-container {
      position: relative;
      top: 30px;
      width: 100%;
      height: 100px;
    }
  }
</style>
