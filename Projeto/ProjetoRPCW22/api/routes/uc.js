const express = require('express')
const router = express.Router()
const UC = require('../controllers/uc')

router.get('/', function (req, res) {
  UC.findall()
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(500).jsonp({ error: error }))
})

router.get('/student/:id', function (req, res) {
  UC.findByUser(req.params.id)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(501).jsonp({ error: error }))
})

router.get('/:nome', function (req, res) {
  UC.find(req.params.nome)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(502).jsonp({ error: error }))
})

router.delete('/:name', function (req, res) {
  UC.remove(req.params.name)
    .then(dados => res.status(200).jsonp(dados))
    .catch(err => res.status(503).jsonp({ error: err }))
})

// Params
router.put('/removeStudent/:name', function (req, res) {
  UC.removeStudentFromUC(req.body.id, req.params.name)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(504).jsonp({ error: error }))
})

// Params
router.put('/addUser/:name', function (req, res) {
  console.log(req.body)
  UC.addUser(req.body.id, req.body.type, req.params.name)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(505).jsonp({ error: error }))
})

router.post('/', function (req, res) {
  const c = {
    name: req.body.name,
    year: req.body.year,
    semester: req.body.semester,
    students: [],
    professors: []
  }
  UC.insert(c)
    .then(data => res.status(200).jsonp(data))
    .catch(error => res.status(506).jsonp({ error: error }))
})

module.exports = router
