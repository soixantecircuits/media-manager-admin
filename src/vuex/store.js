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
}

const store = new Vuex.Store({
  state: {
    filesList: FilesList.files,
    filesCount: FilesList.filesCount,
    nbFilesToDisplay: FilesList.nbFilesToDisplay,
    currentPage: FilesList.currentPage,
    states: FilesList.states
  },
mutations})

export default store
