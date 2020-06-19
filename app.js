//dependencies
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var OpenTok = require('opentok');

var indexRouter = require('./routes/index');

var app = express();
var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;

if (!apiKey || !apiSecret) {
  throw "no apikey or apisecret"
}

opentok = new OpenTok(apiKey, apiSecret);
opentok.createSession({mediaMode:"routed"}, function(error, session) {
  if (error) {
    throw error;
  } else {
    app.set('sessionId', session.sessionId);
    app.listen(3000, function () {
      console.log('listening at 3000');
    });
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes middleware
app.use(function(req, res, next) {
  res.locals.sessionId = app.get('sessionId');
  res.locals.apiKey = apiKey;
  next();
});
app.use('/', indexRouter);

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
