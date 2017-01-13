import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var FilesList = {
  files: [],
  nbFilesToDisplay: 2,
  currentListPage: 0,
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
  }
}

const store = new Vuex.Store({
  state: {
    filesList: FilesList.files,
    nbFilesToDisplay: FilesList.nbFilesToDisplay,
    currentListPage: FilesList.currentListPage,
    states: FilesList.states
  },
mutations})

export default store
