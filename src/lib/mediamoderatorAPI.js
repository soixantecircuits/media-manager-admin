'use strict'
let request = require('superagent/superagent')
const config = require('../../settings/default.json')

let serverDomain = config.moderatorServer || 'localhost:8080'
let apiRoute = config.apiRoute || '/api/v1/medias'

export default {
  getFilesList(limit, cursor, state) {
    return new Promise((resolve, reject) => {
      request.get(`http://${serverDomain}${apiRoute}`)
        .query({ limit: limit })
        .query({ cursor: cursor})
        .query({ state: state })
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
      request.put(`http://${serverDomain}${apiRoute}/${id}`)
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
      request.delete(`http://${serverDomain}${apiRoute}/${id}`)
        .end((err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve({ id: id })
        })
    })
  },

  getConfig() {
    return new Promise((resolve, reject) => {
      request.get(`http://${serverDomain}${apiRoute}/config`)
        .end((err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(JSON.parse(res.text))
        })
    })
  }
}
