const express = require('express')
const router = express.Router()
const Notification = require('../controllers/notifications')
const UC = require('../controllers/uc')
const User = require('../controllers/users')

router.get('/', function (req, res) {
  User.find(req.query['u'])
    .then(user => {
      if (user.type == 'admin') {
        Notification.findall()
          .then(data => res.status(200).jsonp(data))
          .catch(err => res.status(500).jsonp({ error: err }))
      } else {
        UC.findByUser(req.query['u'])
          .then(ucs => {
            ucs.push({name: 'NONE'})
            Promise.all(
              ucs.map(u => {
                return Notification.findByUC(u.name)
              })
            ).then(data => {
              res.status(200).jsonp(data.flat())
            })
            .catch(err => res.status(500).jsonp({ error: err }))
          })
          .catch(err => res.status(501).jsonp({ error: err }))
      }
    })  
})

router.get('/:uc', function (req, res) {
  Notification.findByUC(req.params.uc)
    .then(dados => res.status(200).jsonp(dados))
    .catch(err => res.status(502).jsonp({ error: err }))
})

router.delete('/:id', function (req, res) {
  Notification.remove(req.params.id)
    .then(dados => res.status(200).jsonp(dados))
    .catch(err => res.status(503).jsonp({ error: err }))
})

router.post('/', function (req, res) {
  const data = {
    title: req.body.title,
    content: req.body.content,
    sender: req.body.sender,
    uc: req.body.uc
  }
  Notification.insert(data)
    .then(dados => res.status(200).jsonp(dados))
    .catch(err => res.status(504).jsonp({ error: err }))
})

module.exports = router