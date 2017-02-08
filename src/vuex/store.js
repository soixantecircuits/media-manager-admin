import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var FilesList = {
  statesList: [],
  mediasList: [],
  totalFiles: 0,
  currentPage: 1,
  mediasPerPage: 10,
  stateFilter: ''
}

var MediaDetails = {
  mediaId: '',
  mediaName: '',
  mediaState: '',
  mediaUploadedAt: undefined,
  mediaType: '',
  mediaInfos: {},
  mediaMetas: {}
}

const mutations = {
  setStateFilter(state, val) {
    state.stateFilter = val
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

  setCurrentMediaId(state, id) {
    state.currentMediaId = id
  },
  setCurrentMediaName(state, name) {
    state.currentMediaName = name
  },
  setCurrentMediaState(state, val) {
    state.currentMediaState = val
  },
  setCurrentMediaUploadedAt(state, val) {
    state.currentMediaUploadedAt = val
  },
  setCurrentMediaType(state, type) {
    state.currentMediaType = type
  },
  setCurrentMediaInfos(state, infos) {
    state.currentMediaInfos = infos
  },
  setCurrentMediaMetas(state, metas) {
    state.currentMediaMetas = metas
  }
}

const store = new Vuex.Store({
  state: {
    statesList: FilesList.statesList,
    mediasList: FilesList.mediasList,
    totalMedias: FilesList.totalMedias,
    currentPage: FilesList.currentPage,
    mediasPerPage: FilesList.mediasPerPage,
    stateFilter:FilesList.stateFilter,

    currentMediaId: MediaDetails.mediaID,
    currentMediaName: MediaDetails.mediaName,
    currentMediaState: MediaDetails.mediaState,
    currentMediaUploadedAt: MediaDetails.mediaUploadedAt,
    currentMediaType: MediaDetails.mediaType,
    currentMediaInfos: MediaDetails.mediaInfos,
    currentMediaMetas: MediaDetails.mediaMetas
  },
mutations})

export default store
