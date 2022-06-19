const express = require('express')
const axios = require('axios')
const router = express.Router()
const Middleware = require('./middleware')


router.get('/UC/:id', Middleware.checkAuthenticated, Middleware.isProfessor, function (req, res) {
  axios.get('http://localhost:3011/api/uc/' + req.params.id)
    .then(uc => res.render('uc', { uc: uc.name, user: req.user.name }))
    .catch(error => res.render('error', { error }))
})

router.get('/sendNotification/:uc/:sender', Middleware.checkAuthenticated, Middleware.isProfessor, function (req, res) {
  res.render('createNotification', { sender: req.params.sender, uc: req.params.uc })
})

module.exports = router;