const express = require('express')
const router = express.Router()
const passport = require('passport')
const Middleware = require('./middleware')

router.get('/login', Middleware.checkNotAuthenticated, function(req, res) {
    res.render('login')
})
  
router.post('/login', Middleware.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}))
  
router.get('/logout', Middleware.checkAuthenticated, function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err) }
        res.redirect('/')
    })
})

module.exports = router
