'use strict'
let request = require('superagent/superagent')
const config = require('../../settings/default.json')

let serverDomain = config.moderatorServer || 'localhost:8080'
let apiRoute = config.apiRoute || '/api/v1'

export default {
  getStatesList() {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },

  getFilesList() {
    return new Promise((resolve, reject) => {
      request.get(`http://${serverDomain}${apiRoute}/medias/`)
        .end(function (err, res) {
          if (err) {
            return reject(err)
          }
          let list = JSON.parse(res.text)
          return resolve(list)
        })
    })
  },

  updateState(id, state) {
    return new Promise((resolve, reject) => {
      request.put(`http://${serverDomain}${apiRoute}/medias/${id}`)
        .send({ state: state })
        .end((err, res) => {
          if (err) {
            return reject(err)
          }
          resolve()
        })
    })
  },

  deleteFile(id) {
    return new Promise((resolve, reject) => {
      request.delete(`http://${serverDomain}${apiRoute}/medias/${id}`)
        .end((err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve({ id: id })
        })
    })
  }
}
