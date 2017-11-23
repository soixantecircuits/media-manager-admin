<template>
  <div class="media-edit-part-item" :class="{ selected: selected }">
    <div class="picture" @click="select">
      <img :src="part.thumbnail" v-if="part.thumbnail != ''">
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
    methods: {
      select () {
        this.$emit('select')
      },
      play () {
        this.$emit('play', this.part)
      }
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
