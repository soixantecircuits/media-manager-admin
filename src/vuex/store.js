import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var FilesList = {
  files: [],
  filesCount: 0,
  nbFilesToDisplay: 10,
  currentPage: 1,
  firstCursor: undefined,
  lastCursor: undefined,
  firstFile: undefined,
  lastFile: undefined,
  states: []
}

const mutations = {
  setStateToSearch(state, val) {
    state.stateToSearch = val
  },
  setFirstCursor(state, val) {
    state.firstCursor = val
  },
  setLastCursor(state, val) {
    state.lastCursor = val
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
  setFirstCursor(state, val) {
    state.firstCursor = val
  },
  setLastCursor(state, val) {
    state.lastCursor = val
  },
  setFirstFile(state, file) {
    state.firstFile = file
  },
  setLastFile(state, file) {
    state.lastFile = file
  }
}

const store = new Vuex.Store({
  state: {
    filesList: FilesList.files,
    filesCount: FilesList.filesCount,
    nbFilesToDisplay: FilesList.nbFilesToDisplay,
    currentPage: FilesList.currentPage,
    firstCursor: FilesList.firstCursor,
    lastCursor: FilesList.lastCursor,
    firstFile: FilesList.firstFile,
    lastFile: FilesList.lastFile,
    states: FilesList.states
  },
mutations})

export default store
