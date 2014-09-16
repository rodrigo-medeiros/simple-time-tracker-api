var express = require('express'),
    routes = require('./routes'),jj
    path = require('path'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    http = require('http');

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

app.get('/', routes.index);
app.use('/tasks', tasks.list);
app.use('/users', users.list);

// catch 404 and forwardin to error handling
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if ('development' === app.get('env')) {
  // development only...
  app.use(errorhandler());
}

var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'), function () {
    console.info('Express server listening on port ' + app.get('port'));
  });
};

var shutdown = function () {
  server.close();
};

if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module.');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
