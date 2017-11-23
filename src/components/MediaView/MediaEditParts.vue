<template>
  <div class="media-edit-parts" :class="{ disabled: !hasEditableParts }">
    <div class="title">Edit Part</div>
    <div class="list">
      <div class="empty-list" v-if="!hasEditableParts">
        This video doesn't contain any editable parts.
      </div>
      <media-edit-part-item v-if="hasEditableParts"
                            v-for="(part, i) in editableParts"
                            :part="part" :index="i"
                            :selected="part.selected"
                            @play="play"
                            @select="select(i)">
      </media-edit-part-item>
    </div>
  </div>
</template>
<script>
  import mediaEditor from '../../lib/mediaEditor'
  import MediaEditPartItem from './MediaEditPartItem.vue'

  export default {
    components: {MediaEditPartItem},
    name: 'media-edit-parts',
    mixins: [mediaEditor],
    props: {
      media: {
        type: Object,
        required: true
      },
      selectedIndex: {
        type: Number,
        required: true
      }
    },
    watch: {
      selectedIndex () {
        this.unselectAll()
        this.select(this.selectedIndex)
      }
    },
    methods: {
      unselectAll () {
        for (let i = 0; i < this.editableParts.length; i++) {
          this.editableParts[i].selected = false
        }
      },
      select (i) {
        if (this.editableParts[i].selected) {
          return
        }

        this.unselectAll()
        this.editableParts[i].selected = true
        this.$forceUpdate()
        this.$emit('selected', this.editableParts[i])
      },
      play(part) {
        this.$emit('play', part)
      }
    },
    mounted () {
      this.initMediaEditor()
    }
  }
</script>
<style lang="scss" scoped>
  .media-edit-parts {
    margin-top: 10px;

    .title {
      background-color: #333;
      padding: 20px 30px;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 16px;
      color: #fff;
    }
    .list {
      border-top: 1px solid #000;
      background-color: #1e1e1e;
      color: #d1d1d1;
      width: 100%;
      box-sizing: border-box;
      max-height: 310px;
      overflow: hidden;
      overflow-y: auto;

      .empty-list {
        text-align: center;
        padding: 120px 30px;
        font-weight: 300;
        font-size: 22px;
        color: #ccc;
      }

      .media-edit-part-item {
        border-bottom: 1px solid #000;

        &:last-child {
          border-bottom: none;
        }
        &:nth-child(even) {
          background: #333333;
        }
        &:nth-child(odd) {
          background: #1a1a1a;
        }
        &:hover:nth-child(even) {
          background: #3f3f3f;
        }
        &:hover:nth-child(odd) {
          background: #1f1f1f;
        }
      }
    }
    &.disabled {
      opacity: 0.5;

      .title {
        opacity: 0.7;
      }
    }
  }
</style>
