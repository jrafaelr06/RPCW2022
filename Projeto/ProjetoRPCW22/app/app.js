const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(passport)

var indexRouter = require('./routes/index')
var professorRouter = require('./routes/professors')
var ucRouter = require('./routes/uc')
var authRouter = require('./routes/auth')
var userRouter = require('./routes/user')
var notifRouter = require('./routes/notification')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())
app.use(session({
  secret: 'My secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/professor', professorRouter)
app.use('/uc', ucRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/notifications', notifRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app;