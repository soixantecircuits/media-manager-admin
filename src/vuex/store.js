import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var bucketsList = []
var statesList = []
var currentMediaID = ''
var currentMedia = {}

var FilesList = {
  mediasList: [],
  totalFiles: 0,
  currentPage: 1,
  mediasPerPage: 10,
  stateFilter: ''
}


const mutations = {
  setStateFilter(state, val) {
    state.stateFilter = val
  },
  setBucketsList(state, list) {
    state.bucketsList = list
  },
  setStatesList(state, list) {
    state.statesList = list
  },
  setMediasList(state, list) {
    state.mediasList = list
  },
  setTotalMedias(state, val) {
    state.totalMedias = val
  },
  setCurrentPage(state, newPage) {
    state.currentPage = newPage
  },
  setMediasPerPage(state, val) {
    state.mediasPerPage = val
    if ((state.currentListPage * state.mediasPerPage) >= state.mediasList.length) {
      state.currentListPage = Math.max(Math.floor(state.mediasList.length / state.mediasPerPage) - 1, 0)
    }
  },

  setCurrentMediaID(state, id) {
    state.currentMediaID = id
  },
  setCurrentMedia(state, media) {
    state.currentMedia = media
  }
}

const store = new Vuex.Store({
  state: {
    bucketsList: bucketsList,
    statesList: statesList,
    mediasList: FilesList.mediasList,
    totalMedias: FilesList.totalMedias,
    currentPage: FilesList.currentPage,
    mediasPerPage: FilesList.mediasPerPage,
    stateFilter:FilesList.stateFilter,

    currentMediaID: currentMediaID,
    currentMedia: currentMedia
  },
  getters: {
    getCurrentMediaID: (state, getters) => {
      return state.currentMediaID
    },
    getCurrentMedia: (state, getters) => {
      return state.currentMedia
    }
  },
mutations})

export default store
