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
      <div class="preview-container">
        <canvas id="preview"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
  import timelineBase from '../../lib/timelneBase'

  export default {
    name: 'media-video-fragment',
    mixins: [timelineBase],
    watch: {
      fragmentIn () {
        this.fgIn = this.fragmentIn
      },
      fragmentOut () {
        this.fgOut = this.fragmentOut
      }
    }
  }
</script>
<style lang="scss" scoped>
  .media-video-fragment {
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
    .preview-container {
      height: 110px;
      width: 100%;
    }
  }
</style>
