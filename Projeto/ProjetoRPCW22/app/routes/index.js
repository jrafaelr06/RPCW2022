const express = require('express')
const router = express.Router()
const Middleware = require('./middleware')

router.get('/', Middleware.checkAuthenticated, function(req, res) {
  if (req.user.type === "admin") {
    res.render('homeAdmin', { user: req.user.name })
  } else {
    res.redirect('/user/home')
  }
})

module.exports = router;
