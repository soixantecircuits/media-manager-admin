import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var FilesList = {
  files: [],
  nbFilesToDisplay: 10,
  currentListPage: 0,
  firstCursor: undefined,
  lastCursor: undefined,
  states: []
}

const mutations = {
  setStates(state, states) {
    state.states = states
  },
  setFiles(state, files) {
    state.filesList = files
  },
  addFile(state, file) {
    state.filesList.push(file)
  },
  setCurrentListPage(state, newPage) {
    state.currentListPage = newPage
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
  }
}

const store = new Vuex.Store({
  state: {
    filesList: FilesList.files,
    nbFilesToDisplay: FilesList.nbFilesToDisplay,
    currentListPage: FilesList.currentListPage,
    firstCursor: FilesList.firstCursor,
    lastCursor: FilesList.lastCursor,
    states: FilesList.states
  },
mutations})

export default store
