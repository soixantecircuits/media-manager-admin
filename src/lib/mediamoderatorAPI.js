'use strict'
let request = require('superagent/superagent')
const config = require('../../settings/default.json')

let protocol = 'https'
let serverDomain = config.moderatorServer || 'localhost:8080'
let apiRoute = config.apiRoute || '/api/v1/medias'

export default {
  getFirstFile() {
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${serverDomain}${apiRoute}/first`)
        .end(function (err, res) {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              return getFirstFile()
                .then((result) => {
                  return resolve(result)
                })
                .catch((error) => {
                  return reject(error)
                })
            } else {
              return reject(err)
            }
          } else {
            return resolve(JSON.parse(res.text))
          }
        })
    })
  },

  getLastFile() {
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${serverDomain}${apiRoute}/last`)
        .end(function (err, res) {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              return getLastFile()
                .then((result) => {
                  return resolve(result)
                })
                .catch((error) => {
                  return reject(error)
                })
            } else {
              return reject(err)
            }
          }
          return resolve(JSON.parse(res.text))
        })
    })
  },

  getFilesCount() {
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${serverDomain}${apiRoute}/count`)
        .end(function (err, res) {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              return getFilesCount()
                .then((result) => {
                  return resolve(result)
                })
                .catch((error) => {
                  return reject(error)
                })
            } else {
              return reject(err)
            }
          }
          return resolve(JSON.parse(res.text))
        })
    })
  },

  getFilesList(limit, cursor, state) {
    let instance = this
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${serverDomain}${apiRoute}`)
        .query({ limit: limit })
        .query({ cursor: cursor})
        .query({ state: state })
        .end(function (err, res) {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              return instance.getFilesList(limit, cursor, state)
                .then((result) => {
                  return resolve(result)
                })
                .catch((error) => {
                  return reject(error)
                })
            } else {
              return reject(err)
            }
          }
          let list = JSON.parse(res.text)
          return resolve(list)
        })
    })
  },

  updateState(id, state) {
    return new Promise((resolve, reject) => {
      request.put(`${protocol}://${serverDomain}${apiRoute}/${id}`)
        .send({ state: state })
        .end((err, res) => {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              return updateState(id, state)
                .then((result) => {
                  return resolve(result)
                })
                .catch((error) => {
                  return reject(error)
                })
            } else {
              return reject(err)
            }
          }
          return resolve(res)
        })
    })
  },

  deleteFile(id) {
    return new Promise((resolve, reject) => {
      request.delete(`${protocol}://${serverDomain}${apiRoute}/${id}`)
        .end((err, res) => {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              return deleteFile(id)
                .then((result) => {
                  return resolve(result)
                })
                .catch((error) => {
                  return reject(error)
                })
            } else {
              return reject(err)
            }
          }
          return resolve({ id: id })
        })
    })
  },

  getConfig() {
    let instance = this
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${serverDomain}${apiRoute}/config`)
        .end((err, res) => {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              return this.getConfig()
                .then((result) => {
                  return resolve(result)
                })
                .catch((error) => {
                  return reject(error)
                })
            } else {
              return reject(err)
            }
          } else {
            return resolve(JSON.parse(res.text))
          }
        })
    })
  }
}
