const express = require('express')
const router = express.Router()
const User = require('../controllers/users')
const Class = require('../controllers/uc')

router.get('/', function (req, res) {
  User.findall()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp({ error: error }))
})

router.get('/:id', function (req, res) {
  User.find(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(501).jsonp({ error: error }))
})

router.delete('/:id', function (req, res) {
  const id = req.params.id
  User.remove(id)
    .then(() => {
      Class.removeStudent(id)
        .then(data => res.status(200).jsonp(data))
        .catch(error => res.status(502).jsonp({ error: error }))
    })
    .catch(error => res.status(503).jsonp({ error: error }))
})

router.post('/', function (req, res) {
  const user = {
    id: req.body.id,
    pw: req.body.pw,
    name: req.body.name,
    type: req.body.type
  }

  User.insert(user)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(504).jsonp({ error: error }))
})

module.exports = router
