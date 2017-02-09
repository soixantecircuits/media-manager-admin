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

  getTotalMedias(state) {
    return new Promise((resolve, reject) => {
      let moderatorRequest = request.get(`${protocol}://${serverDomain}${apiRoute}/count`)

      if (state && state !== '' && state !== 'any') {
        moderatorRequest.query({ state: state })
      }

      moderatorRequest.end(function (err, res) {
        if (err) {
          if (protocol === 'https') {
            protocol = 'http'
            return getTotalMedias()
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

  getMediasList(page, perPage, state) {
    let instance = this
    return new Promise((resolve, reject) => {
      let moderatorRequest = request.get(`${protocol}://${serverDomain}${apiRoute}`)
        .query({ page: page})
        .query({ per_page: perPage })

      if (state && state !== '' && state !== 'any') {
        moderatorRequest.query({ state: state })
      }

      moderatorRequest.end(function (err, res) {
        if (err) {
          if (protocol === 'https') {
            protocol = 'http'
            return instance.getMediasList(page, perPage, state)
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

  getMediaDetails(id) {
    let instance = this
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${serverDomain}${apiRoute}/${id}/details`)
        .end((err, res) => {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              instance.getMediaDetails(id)
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
            return resolve(res.body)
          }
        })
    })
  },

  getMediaMetas(id) {
    let instance = this
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${serverDomain}${apiRoute}/${id}/metas`)
        .end((err, res) => {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              instance.getMediaMetas(id)
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
            return resolve(res.body)
          }
        })
    })
  },

  setState(id, state) {
    let instance = this
    return new Promise((resolve, reject) => {
      request.put(`${protocol}://${serverDomain}${apiRoute}/${id}`)
        .send({ state: state })
        .end((err, res) => {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              instance.setState(id, state)
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
            return resolve(res)
          }
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
