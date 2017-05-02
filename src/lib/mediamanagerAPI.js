'use strict'
let request = require('superagent/superagent')
const config = SETTINGS

let protocol = 'https'
let server = config.service.mediaManager.server || 'localhost'
let port = config.service.mediaManager.port || 8080
let apiRoute = config.service.mediaManager.apiRoute || '/api/v1'

export default {
  getBuckets() {
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/buckets`)
      .end(function (err, res) {
        if (err) {
          if (protocol === 'https') {
            return getBuckets()
            .then(res => {
              return resolve(res)
            })
            .catch(err => {
              return reject(err)
            })
          } else {
            return reject(err)
          }
        } else {
          return resolve(JSON.parse(res.text).data)
        }
      })
    })
  },

  getFirstFile() {
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/first`)
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
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/last`)
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
      let moderatorRequest = request.get(`${protocol}://${server}:${port}${apiRoute}/medias/count`)

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
      let moderatorRequest = request.get(`${protocol}://${server}:${port}${apiRoute}/medias`)
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

  getMediaInfos(id) {
    let instance = this
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/${id}`)
        .end((err, res) => {
          if (err) {
            if (protocol === 'https') {
              protocol = 'http'
              instance.getMediaInfos(id)
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
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/${id}/metas`)
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
      request.put(`${protocol}://${server}:${port}${apiRoute}/medias/${id}`)
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
      request.delete(`${protocol}://${server}:${port}${apiRoute}/medias/${id}`)
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
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/settings`)
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
