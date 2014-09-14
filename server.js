var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');

var routes = require('./routes/index'),
    users = require('./routes/users'),
    tasks = require('./routes/tasks');

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

app.use('/', routes);
app.use('/tasks', tasks);
app.use('/users', users);

// catch 404 and forwardin to error handling
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stack trace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    })
  });
}

// production error handler
// no stack traces leaked to user

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
