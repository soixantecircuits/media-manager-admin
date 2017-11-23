<template>
  <div class="media-edit-parts" :class="{ disabled: !hasEditableParts }">
    <div class="title">Edit Part</div>
    <div class="list">
      <div class="empty-list" v-if="!hasEditableParts">
        This video doesn't contain any editable parts.
      </div>
      <div v-if="hasEditableParts">
        <media-edit-part-item v-for="(part, i) in partsList"
                              :part="part" :index="i"
                              :selected="i === selectedIndex"
                              :ref="'part' + i.toString()"
                              @play="play"
                              @select="select(i)">
        </media-edit-part-item>
        <div class="buffer-container">
          <video :src="media.meta.etnaInput.url" id="buffer" muted></video>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import mediaEditor from '../../lib/mediaEditor'
  import duration from '../../lib/duration'
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
      parts: {
        type: Array,
        required: true
      },
      selectedIndex: {
        type: Number,
        required: true
      }
    },
    methods: {
      select (i) {
        this.$emit('selected', this.partsList[i])
      },
      play (part) {
        this.$emit('play', part)
      },
      whoNeedThumbnail () {
        for (let i = 0; i < this.partsList.length; i++) {
          if (!('hasThumbnail' in this.partsList[i]) || !this.partsList[i].hasThumbnail) {
            return i
          }
        }

        return -1
      },
      updateThumbnails () {
        this.video.removeEventListener('canplaythrough', this.updateThumbnails)

        const w = this.video.videoWidth
        const h = this.video.videoHeight

        let needy = this.whoNeedThumbnail()
        if (needy < 0) {
          return
        }

        this.$refs['part' + needy][0].updateThumbnail(this.video, w, h)
        this.partsList[needy].hasThumbnail = true

        needy = this.whoNeedThumbnail()
        if (needy < 0) {
          return
        }

        this.video.currentTime = duration.toMilliseconds(this.partsList[needy].in) / 1000
        this.video.addEventListener('canplaythrough', this.updateThumbnails)
        this.video.pause()
      }
    },
    mounted () {
      this.initMediaEditor()
      this.partsList = this.parts

      if (this.partsList.length > 0) {
        let vm = this
        this.$nextTick(() => {
          vm.video = document.querySelector('#buffer')
          vm.video.addEventListener('canplaythrough', this.updateThumbnails)
          vm.video.currentTime = duration.toMilliseconds(this.partsList[0].in) / 1000
        })
      }
    },
    data () {
      return {
        partsList: [],
        video: null
      }
    }
  }
</script>
<style lang="scss" scoped>
  .media-edit-parts {
    margin-top: 10px;

    #buffer {
      display: none;
    }

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
