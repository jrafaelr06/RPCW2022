const express = require('express')
const axios = require('axios')
const router = express.Router()
const Middleware = require('./middleware')

router.get('/', function (req, res) {
  axios.get('http://localhost:3011/api/users')
    .then(data => {res.render('users', { data: data.data })})
    .catch(error => res.render('error', { error: error }))
})

router.get('/home', (req, res) => {
  axios.get('http://localhost:3011/api/uc/student/' + req.user.id)
    .then(data => {
      req.user.classes = data.data
      console.log(req.user.classes)
      res.render('home', { user: req.user })
    })
    .catch(error => res.render('error', { error }))
})


router.get('/add', function (req, res) {
  res.render('addUser')
})

router.get('/remove/:id', Middleware.checkAuthenticated, Middleware.isAdmin, function (req, res) {
  axios.delete('http://localhost:3011/api/users/' + req.params.id)
    .then(res.redirect('/user'))
    .catch(error => res.render('error', { error: error }))
})

router.post('/add', function (req, res) {
  const user = {
    id: req.body.id,
    pw: req.body.pw,
    name: req.body.name,
    type: req.body.type
  }

  axios.post('http://localhost:3011/api/users', user)
    .then(data => res.render('newUser', { type: "Utilizador" }))
    .catch(error => { res.render('error', { error: error }) })
})

module.exports = router