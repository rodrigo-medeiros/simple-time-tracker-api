var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    bodyParser = require('body-parser'),
    errorhandler = require('errorhandler'),
    http = require('http'),
    mongoose = require('mongoose'),
    models = require('./models'),
    dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/simple_time_tracker',
    db = mongoose.connect(dbUrl, {safe: true});

var app = express();

app.use(function (req, res, next) {
  if (!models.User || !models.Task || !models.WorkLog) return next(new Error('There are no models.'));
  req.models = models;
  return next();
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

var router = express.Router();

router.get('/tasks', routes.task.list);
router.get('/tasks/:id', routes.task.findById);
router.get('/tasks/user/:userId', routes.task.findByUser);
router.get('/users', routes.user.list);
app.use('/api', router);

if ('development' === app.get('env')) {
  // development only...
  app.use(errorhandler());
}

app.all('*', function (req, res) {
  res.send(404).end();
});

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
