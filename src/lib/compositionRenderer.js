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
let getUpdatedMelt = (melt, parts) => {
  let $ = cheerio.load(melt, {xmlMode: true})

  if(parts && parts.length) {
    for(let i = 0; i < parts.length; i++) {
      let $entry = $('entry[producer="' + parts[i].producer.id + '"]')

      if($entry.length > 0) {
        $entry.attr('in', parts[i].in)
        $entry.attr('out', parts[i].out)
      }
    }
  }

  return $.html()
}

export default {
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
            scriptString: getUpdatedMelt(this.media.meta.melt.scriptString, this.editableParts)
          }
        }
      })

      this.$spacebro.emit(this.getSettings().service.spacebro.client.out.outMedia.eventName, mediaData)
    },
    haveAnyFragmentsBeenUpdated () {
      let updated = false
      for(let i = 0; i < this.editableParts.length; i++) {
        if(this.editableParts[i].in !== this.editableParts[i].initialIn || this.editableParts[i].out !== this.editableParts[i].initialOut) {
          updated = true
          break
        }
      }

      return updated
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

      if(!this.haveAnyFragmentsBeenUpdated()) {
        alert('There\'s nothing to render. Composition haven\'t been updated.')
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