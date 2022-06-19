const express = require('express')
const axios = require('axios')
const router = express.Router()
const Middleware = require('./middleware')

router.get('/', Middleware.checkAuthenticated, Middleware.isAdmin, function (req, res) {
  axios.get('http://localhost:3011/api/notifications?u=' + req.user.id)
    .then(notifs => res.render('notifications', { data: notifs.data, user: req.user }))
    .catch(error => res.render('error', { error }))
})

router.get('/create', Middleware.checkAuthenticated, Middleware.isProfessor, function (req, res) {
  res.render('addNotification', { sender: "Geral", uc: "NONE" })
})

router.get('/remove/:id', Middleware.checkAuthenticated, Middleware.isProfessor, function (req, res) {
  axios.delete('http://localhost:3011/api/notifications/' + req.params.id)
    .then(res.redirect('/notifications'))
    .catch(error => res.render('error', { error }))
})

router.post('/', Middleware.checkAuthenticated, Middleware.isProfessor, function (req, res) {
  const data = {
    title: req.body.title,
    content: req.body.warning,
    sender: req.body.sender,
    uc: req.body.uc
  }

  axios.post('http://localhost:3011/api/notifications/', data)
    .then(() => {
      if (req.user.type == 'admin')
        res.redirect('/notifications')
      else
        res.redirect('/uc/notifications/' + data.uc)
    })
    .catch(error => res.render('error', { error }))
})

module.exports = router