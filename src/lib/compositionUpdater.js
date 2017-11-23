let cheerio = require('cheerio')
let assignment = require('assignment')
let duration = require('./duration')

/**
 * Update entry in the melt and return updated melt code
 * @param melt
 * @param part
 * @param newInMilliseconds
 * @param newOutMilliseconds
 */
let getUpdatedMelt = (melt, part, newInMilliseconds, newOutMilliseconds) => {
  let $ = cheerio.load(melt, {xmlMode: true})
  let $entry = $('entry[producer="' + part.producer.id + '"]')

  if($entry.length > 0) {
    let newIn = duration.toDuration(newInMilliseconds)
    let newOut = duration.toDuration(newOutMilliseconds)

    $entry.attr('in', newIn)
    $entry.attr('out', newOut)
  }

  return $.html()
}

export default {
  props: {
    media: {
      type: Object,
      required: true
    }
  },
  methods: {
    compositionWasUpdated () {
      this.progressValue = 0
      this.initFragmentIn = this.fragmentIn
      this.initFragmentOut = this.fragmentOut
      this.$emit('update', this.fragmentIn, this.fragmentOut)
      this.updatingComposition = false
    },
    emitSpacebroUpdateEvent () {
      let mediaData = this.media.meta.etnaInput
      mediaData = assignment(mediaData, {
        meta: {
          melt: {
            scriptString: getUpdatedMelt(this.media.meta.melt.scriptString, this.selectedPart, this.fragmentIn, this.fragmentOut)
          }
        }
      })

      this.$spacebro.emit(this.getSettings().service.spacebro.client.out.outMedia.eventName, mediaData)
    },
    updateComposition () {
      if (!this.$spacebro || !this.$spacebro.connected) {
        alert('Not connected to spacebro!')
        return
      }

      if (!this.media.meta || !this.media.meta.etnaInput || !this.media.meta.melt || !this.media.meta.melt.scriptString) {
        console.error('The media doesn\'t contain melt')
        return
      }

      if (!this.selectedPart) {
        console.error('No part has been selected')
        return
      }

      this.emitSpacebroUpdateEvent()

      let vm = this
      let promise = new Promise((resolve) => {
        vm.updatingComposition = true
        vm.spacebroUpdated = false

        let interval = setInterval(() => {
          vm.progressValue += 5

          if (vm.progressValue >= 100) {
            clearInterval(interval)
            vm.compositionWasUpdated()

            if (resolve) {
              resolve()
            }
          }
        }, 100)
      })

      return promise
    },
  },
  data () {
    return {
      progressValue: 0,
      updatingComposition: false
    }
  }
}