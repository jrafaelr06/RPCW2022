const express = require('express')
const axios = require('axios')
const router = express.Router()
var multer = require('multer')
var upload = multer({ dest: 'files' })
const fs = require('fs')
const Middleware = require('./middleware')

router.get('/', Middleware.checkAuthenticated, Middleware.isAdmin, function (req, res) {
  axios.get('http://localhost:3011/api/uc')
    .then(data => res.render('classes', { data: data.data }))
    .catch(error => res.render('error', { error }))
})

router.get('/add', Middleware.checkAuthenticated, Middleware.isAdmin, function (req, res) {
  res.render('addClass')
})

router.get('/remove/:name', Middleware.checkAuthenticated, Middleware.isAdmin, function(req, res) {
  axios.delete('http://localhost:3011/api/uc/' + req.params.name)
    .then(res.redirect('/uc'))
    .catch(error => res.render('error', { error }))
})

router.get('/addStudent/:id', Middleware.checkAuthenticated, Middleware.isAdmin, function(req, res) {
  axios.get('http://localhost:3011/api/uc/' + req.params.id)
    .then(resp => res.render('addStudent', { data: resp.data }))
    .catch(error => res.render('error', { error: error }))
})

router.get('/removeStudent/:name', Middleware.checkAuthenticated, Middleware.isAdmin, function (req, res) {
  const body = {
    id: req.query.user
  }
  axios.put('http://localhost:3011/api/uc/removeStudent/' + req.params.name, body)
    .then(res.redirect('/uc/addStudent/' + req.params.name))
    .catch(error => res.render('error', { error }))
})

router.get('/notifications/create/:nome', Middleware.checkAuthenticated, Middleware.isProfessor, function (req, res) {
  res.render('addNotification', { sender: req.user.name, uc: req.params.nome })
})

router.get('/notifications/:nome', Middleware.checkAuthenticated, function (req, res) {
  axios.get('http://localhost:3011/api/notifications/' + req.params.nome)
    .then(notifs => { res.render('notifications', { data: notifs.data, user: req.user, uc: req.params.nome}) })
    .catch(error => res.render('error', { error }))
})

router.get('/content/remove/:id', Middleware.checkAuthenticated, Middleware.isProfessor, function (req, res) {
  axios.delete('http://localhost:3011/api/recursos/' + req.params.id)
    .then(data => {
      fs.unlinkSync(__dirname + '/../files/' + req.params.id)
      res.redirect('/uc/content/' + req.query['uc'])
    })
    .catch(error => {
      res.render('error', { error })
    })
})

router.get('/content/download/:file', Middleware.checkAuthenticated, function (req, res) {
  res.download(__dirname + '/../files/' + req.params.file, "download.zip")
})

router.get('/content/:nome', Middleware.checkAuthenticated, function (req, res) {
  axios.get('http://localhost:3011/api/recursos?uc=' + req.params.nome)
    .then(data => {
      console.log(data.data)
      res.render('content' , {data: data.data, user: req.user, uc:req.params.nome})
    })
    .catch(error => {
      res.render('error', { error })
    })
})

router.get('/:nome', Middleware.checkAuthenticated, function (req, res) {
  axios.get('http://localhost:3011/api/uc/' + req.params.nome)
    .then(uc => { res.render('uc', { uc: uc.data.name, user: req.user }) })
    .catch(error => res.render('error', { error }))
})

router.post('/addUser', Middleware.checkAuthenticated, Middleware.isAdmin, function (req, res) {
  axios.get('http://localhost:3011/api/users/' + req.body.id)
    .then(user => {
      axios.put('http://localhost:3011/api/uc/addUser/' + req.body.uc, user.data)
        .then(res.redirect('/uc/addStudent/' + req.body.uc))
        .catch(error => res.render('error', { error }))
    })
    .catch(error => res.render('error', { error }))
})

router.post('/add', Middleware.checkAuthenticated, Middleware.isAdmin, function(req, res) {
  const c = {
    name: req.body.name,
    year: req.body.year,
    semester: req.body.semester,
  }
  axios.post('http://localhost:3011/api/uc/', c)
    .then(res.render('newUser', { type: "Unidade Curricular" }))
    .catch(error => res.render('error', { error: error }))
})

router.post('/content', Middleware.checkAuthenticated, upload.single('myFile'), (req, res) => {
  // Função de store no mongo
  let meta = {
    "_id": req.file.filename,
    "submission_date": new Date().toISOString().substring(0, 16),
    "sub_id": req.body.producer,
    "title": req.body.title,
    "type": req.body.type,
    "uc": req.body.uc
  }
  axios.post('http://localhost:3011/api/recursos', meta)
    .then(() => {
        res.redirect('/uc/' + meta.uc)
    })
    .catch(err => {
      res.render('error', { error: err })
    })
})
module.exports = router
