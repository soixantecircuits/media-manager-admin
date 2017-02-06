import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var FilesList = {
  files: [],
  filesCount: 0,
  nbFilesToDisplay: 10,
  currentPage: 1,
  states: []
}

var MediaDetails = {
  mediaId: '',
  mediaName: '',
  mediaState: '',
  mediaUploadedAt: undefined,
  mediaInfos: {},
  mediaMetas: {}
}

const mutations = {
  setStateToSearch(state, val) {
    state.stateToSearch = val
  },
  setStates(state, states) {
    state.states = states
  },
  setFiles(state, files) {
    state.filesList = files
  },
  addFile(state, file) {
    state.filesList.push(file)
  },
  setFilesCount(state, val) {
    state.filesCount = val
  },
  setCurrentPage(state, newPage) {
    state.currentPage = newPage
  },
  setNbFilesToDisplay(state, nb) {
    state.nbFilesToDisplay = nb
    if ((state.currentListPage * state.nbFilesToDisplay) >= state.filesList.length) {
      state.currentListPage = Math.max(Math.floor(state.filesList.length / state.nbFilesToDisplay) - 1, 0)
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
  setCurrentMediaInfos(state, infos) {
    state.currentMediaInfos = infos
  },
  setCurrentMediaMetas(state, metas) {
    state.currentMediaMetas = metas
  }
}

const store = new Vuex.Store({
  state: {
    filesList: FilesList.files,
    filesCount: FilesList.filesCount,
    nbFilesToDisplay: FilesList.nbFilesToDisplay,
    currentPage: FilesList.currentPage,
    states: FilesList.states,

    currentMediaId: MediaDetails.mediaID,
    currentMediaName: MediaDetails.mediaName,
    currentMediaState: MediaDetails.mediaState,
    currentMediaUploadedAt: MediaDetails.mediaUploadedAt,
    currentMediaInfos: MediaDetails.mediaInfos,
    currentMediaMetas: MediaDetails.mediaMetas
  },
mutations})

export default store
