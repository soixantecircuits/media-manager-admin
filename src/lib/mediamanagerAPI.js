'use strict'

let request = require('superagent')
const config = SETTINGS

let protocol = config.service.mediaManager.protocol || 'http'
let server = config.service.mediaManager.server || 'localhost'
let port = config.service.mediaManager.port || 8080
let apiRoute = config.service.mediaManager.apiRoute || '/api/v1'

export default {

  getBuckets () {
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/buckets`)
        .end(function (err, res) {
          if (err) {
            return reject(err)
          }

          try {
            var ret = JSON.parse(res.text).data
          } catch (error) {
            return reject(error)
          }
          return resolve(ret)
        })
    })
  },

  getFirstFile () {
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/first`)
        .end(function (err, res) {
          if (err) {
            return reject(err)
          }

          try {
            var ret = JSON.parse(res.text)
          } catch (error) {
            return reject(error)
          }
          return resolve(ret)
        })
    })
  },

  getLastFile () {
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/last`)
        .end(function (err, res) {
          if (err) {
            return reject(err)
          }

          try {
            var ret = JSON.parse(res.text)
          } catch (error) {
            return reject(error)
          }
          return resolve(ret)
        })
    })
  },

  getTotalMedias (state) {
    return new Promise((resolve, reject) => {
      let moderatorRequest = request.get(`${protocol}://${server}:${port}${apiRoute}/medias/count`)

      if (state && state !== '' && state !== 'any') {
        moderatorRequest.query({ state: state })
      }

      moderatorRequest.end(function (err, res) {
        if (err) {
          return reject(err)
        }

        try {
          var ret = JSON.parse(res.text)
        } catch (error) {
          return reject(error)
        }
        return resolve(ret)
      })
    })
  },

  getMediasList (page, perPage, state) {
    let instance = this
    return new Promise((resolve, reject) => {
      let moderatorRequest = request.get(`${protocol}://${server}:${port}${apiRoute}/medias`)
        .query({ page: page })
        .query({ per_page: perPage })

      if (state && state !== '' && state !== 'any') {
        moderatorRequest.query({ state: state })
      }

      moderatorRequest.end(function (err, res) {
        if (err) {
          return reject(err)
        }

        try {
          var list = JSON.parse(res.text)
        } catch (error) {
          return reject(error)
        }
        return resolve(list)
      })
    })
  },

  getMediaInfos (id) {
    let instance = this
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/${id}`)
        .end((err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res.body)
        })
    })
  },

  getMediaMetas (id) {
    let instance = this
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/${id}/metas`)
        .end((err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res.body)
        })
    })
  },

  setState (id, state) {
    let instance = this
    return new Promise((resolve, reject) => {
      request.put(`${protocol}://${server}:${port}${apiRoute}/medias/${id}`)
        .send({ state: state })
        .end((err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(res)
        })
    })
  },

  deleteFile (id) {
    return new Promise((resolve, reject) => {
      request.delete(`${protocol}://${server}:${port}${apiRoute}/medias/${id}`)
        .end((err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve({ id: id })
        })
    })
  },

  getConfig () {
    let instance = this
    return new Promise((resolve, reject) => {
      request.get(`${protocol}://${server}:${port}${apiRoute}/medias/settings`)
        .end((err, res) => {
          if (err) {
            return reject(err)
          }

          try {
            var ret = JSON.parse(res.text)
          } catch (error) {
            return reject(error)
          }
          return resolve(ret)
        })
    })
  }
}
