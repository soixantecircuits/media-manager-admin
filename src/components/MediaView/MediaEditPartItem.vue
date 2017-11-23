<template>
  <div class="media-edit-part-item" :class="{ selected: selected }">
    <div class="picture" @click="select">
      <canvas :id="'c' + part.producer.id"></canvas>
    </div>
    <div class="data" @click="select">
      <span class="label">{{ part.index }}</span>
      <span class="name">{{ part.producer.title }}</span>
    </div>
    <div class="data" @click="select">
      <div class="label">In :</div>
      <div class="name">{{ part.in }}</div>
    </div>
    <div class="data" @click="select">
      <div class="label">Out :</div>
      <div class="name">{{ part.out }}</div>
    </div>
    <div class="data play">
      <a href="#" @click.prevent="play">Play</a>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'media-edit-part-item',
    props: {
      part: {
        type: Object,
        required: true
      },
      selected: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        canvas: null,
        ctx: null
      }
    },
    methods: {
      select () {
        this.$emit('select')
      },
      play () {
        this.$emit('play', this.part)
      },
      updateThumbnail (video, w, h) {
        this.ctx.drawImage(video, 0, 0, w, h, 0, 0, this.canvas.width, this.canvas.height)
      },
      initCanvas () {
        this.canvas = document.getElementById('c' + this.part.producer.id)
        this.ctx = this.canvas.getContext('2d')
        let picture = document.querySelector('.media-edit-part-item > .picture')
        let w = picture.offsetWidth
        let h = picture.offsetHeight

        this.canvas.width = w
        this.canvas.height = h

        this.ctx.fillStyle = '#222'
        this.ctx.fillRect(0, 0, w, h)
      }
    },
    mounted () {
      this.initCanvas()
    }
  }
</script>
<style lang="scss" scoped>
  .media-edit-part-item {
    display: table;
    width: 100%;

    &.selected {
      background: #fd4f4f !important;
      color: #fff;
    }

    .picture {
      width: 15%;
      background: rgba(255, 255, 255, 0.3);
      overflow: hidden;
      vertical-align: middle;

      img {
        width: 100%;
        height: auto;
      }
    }

    & > div {
      display: table-cell;
    }

    .data {
      padding: 15px 20px;

      .label, .name {
        display: block;
        font-size: 14px;
      }

      .name {
        font-weight: bold;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.play {
        vertical-align: middle;
        a {
          display: inline-block;
          width: 32px;
          height: 32px;
          background: url('../../assets/img/play.png') center center no-repeat;
          background-size: contain;
          text-indent: -500em;
        }
      }
    }
  }
</style>
