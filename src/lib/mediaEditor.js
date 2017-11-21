var cheerio = require('cheerio')

let editableParts = []
let currentId = ''

/**
 * Get an array of producers
 * @param $
 * @param $producers
 * @returns {Array}
 */
let extractProducers = ($, $producers) => {
  let producers = []

  $producers.each((i, el) => {
    producers.push({
      id: $(el).attr('id'),
      title: $(el).attr('title')
    })
  })

  return producers
}

let extractEntries = ($, $playlists, producers) => {
  let entries = []

  let findProducerById = (producerId) => {
    for (let i = 0; i < producers.length; i++) {
      if (producers[i].id === producerId) {
        return producers[i]
      }
    }

    return false
  }

  $playlists.each((i, playlist) => {
    if ($(playlist).children().length > 0) {
      $(playlist).find('entry').each((j, entry) => {
        let producerId = $(entry).attr('producer')
        if (producerId) {
          let producer = findProducerById(producerId)
          if (false === producer) {
            return
          }

          entries.push({
            in: $(entry).attr('in'),
            out: $(entry).attr('out'),
            producer: producer
          })
        }
      })
    }
  })

  return entries
}

/**
 * Get a list of editable parts from melt XML
 * @param melt
 * @returns {Array}
 */
let getEditableParts = (melt) => {
  let $ = cheerio.load(melt, {xmlMode: true})
  let $playlists = $('playlist#playlist1', 'mlt')
  let $producers = $('producer', 'mlt')

  if (!$playlists || !$playlists.length || !$producers || !$producers.length) {
    return []
  }

  return extractEntries($, $playlists, extractProducers($, $producers))
}

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
      if (media.meta && media.meta.etnaInput && media.meta.melt && media.meta.melt.scriptString) {
        if (currentId !== media._id) {
          editableParts = getEditableParts(media.meta.melt.scriptString)
        }

        this.editableParts = editableParts
        console.log(this.editableParts)
      }

      currentId = media._id
    }
  },
  data () {
    return {
      editableParts: []
    }
  }
}