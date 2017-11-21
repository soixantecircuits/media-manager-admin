export default {
  computed: {
    hasEditableParts () {
      return this.editableParts && this.editableParts.length > 0
    }
  },
  methods: {
    initMediaEditor (media) {
      if (!media && !this.media) {
        console.error('No media is available')
        return
      }

      media = this.media
    }
  },
  data () {
    return {
      editableParts: []
    }
  }
}