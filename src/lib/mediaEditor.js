import Vue from 'vue'
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

/**
 * Extract <entry> tags
 * @param $
 * @param $playlists
 * @param producers
 * @param thumbnail
 * @returns {Array}
 */
let extractEntries = ($, $playlists, producers, thumbnail) => {
  let entries = []

  let findProducerById = (producerId) => {
    for (let i = 0; i < producers.length; i++) {
      if (producers[i].id === producerId) {
        return producers[i]
      }
    }

    return false
  }

  let formatIndex = (index) => {
    return 'Edit ' + (index > 10 ? '' : '0') + index.toString()
  }

  let index = 0
  $playlists.each((i, playlist) => {
    if ($(playlist).children().length > 0) {
      $(playlist).find('entry').each((j, entry) => {
        let producerId = $(entry).attr('producer')
        if (producerId) {
          let producer = findProducerById(producerId)
          if (false === producer) {
            return
          }

          index++
          entries.push({
            index: formatIndex(index),
            in: $(entry).attr('in'),
            out: $(entry).attr('out'),
            thumbnail: thumbnail,
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
 * @param media
 * @returns {Array}
 */
let getEditableParts = (media) => {
  if (!media.meta || !media.meta.etnaInput || !media.meta.melt || !media.meta.melt.scriptString) {
    return []
  }

  let $ = cheerio.load(media.meta.melt.scriptString, {xmlMode: true})
  let $playlists = $('playlist#playlist1', 'mlt')
  let $producers = $('producer', 'mlt')

  if (!$playlists || !$playlists.length || !$producers || !$producers.length) {
    return []
  }

  // TODO: Most likely this should be removed and a thumbnail should be taken for each video fragment in the future
  let thumbnail = ''
  if (media.meta && media.meta.etnaInput && media.meta.etnaInput.details && media.meta.etnaInput.details.thumbnail) {
    thumbnail = media.meta.etnaInput.details.thumbnail.url
  }

  return extractEntries($, $playlists, extractProducers($, $producers), thumbnail)
}

export default {
  computed: {
    hasEditableParts () {
      return this.editableParts && Object.keys(this.editableParts).length > 0
    }
  },
  methods: {
    initMediaEditor (media) {
      if (!media && !this.media) {
        console.error('No media is available')
        return
      }

      media = this.media
      editableParts = []

      if (media.meta && media.meta.etnaInput && media.meta.melt && media.meta.melt.scriptString) {
        editableParts = getEditableParts(media)
      }

      this.$set(this, 'editableParts', editableParts)
      currentId = media._id
    }
  },
  data () {
    return {
      editableParts: []
    }
  }
}