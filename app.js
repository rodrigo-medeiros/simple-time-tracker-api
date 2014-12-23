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
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);

app.use(function (req, res, next) {
  if (!models.User || !models.Task || !models.Worklog) return next(new Error('There are no models.'));
  req.models = models;
  return next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);

var router = express.Router();

router.param('task_id', routes.task.findByTaskId);
router.post('/task', routes.task.add);
router.get('/task/:task_id', routes.task.getTask);
router.post('/task/:task_id/worklog', routes.task.addWorklog);
router.get('/task/:task_id/worklog', routes.task.getWorklogs);

router.param('user_id', routes.user.findByUserId);
router.post('/user', routes.user.add);
router.get('/user/:user_id', routes.user.getUser);
router.get('/user/:user_id/task', routes.user.getTasks);
router.get('/user/:user_id/worklog', routes.user.getWorklogs);
router.delete('/user/:user_id', routes.user.del);

router.get('/worklog/:id', routes.worklog.findById);
router.delete('/worklog/:id', routes.worklog.del);

app.use('/api', router);

if ('development' === app.get('env')) {
  // development only...
  app.use(errorhandler());
}

app.all('*', function (req, res) {
  res.status(404).end();
});

var server = http.createServer(app);
var boot = function () {
  server.listen(app.get('port'), function () {
    if ('development' !== app.get('env')) {
      console.info('Express server listening on port ' + app.get('port'));
    }
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
