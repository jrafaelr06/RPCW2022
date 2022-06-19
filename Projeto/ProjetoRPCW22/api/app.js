var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose')

var recursosRouter = require('./routes/recursos');
var notificationsRouter = require('./routes/notifications');
var ucRouter = require('./routes/uc');
var usersRouter = require('./routes/users');

var mongoDB = 'mongodb://127.0.0.1/RRD2022'

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

var db = mongoose.connection
db.on('error', () => {
  console.log('Erro na conexão ao MongoDB...')
})
db.once('open', () => {
  console.log('Conexão ao MongoDB efetuada com sucesso.')
})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/recursos', recursosRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/uc', ucRouter);
app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
