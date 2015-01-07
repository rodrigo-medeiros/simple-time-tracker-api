var async = require('async');

exports.findByUserId = function (req, res, next, user_id) {
  req.models.User.findById(
    user_id,
    function (error, user) {
      if (error) return next(error);
      if (!user) return res.status(404).end();
      req.user = user;
      next();
  });
};

exports.getUser = function (req, res, next) {
  var user = req.user;
  res.json({ user: user });
};

exports.getTasks = function (req, res, next) {
  var user = req.user;
  req.models.Task.findByUserId(
    user.id,
    function (error, tasks) {
      if (error) return next(error);
      if (!tasks || !tasks.length)
        return res.status(404).end();
      res.json({ tasks: tasks });
  });
};

exports.getWorklogs = function (req, res, next) {
  var user = req.user;
  req.models.Worklog.findByUserId(
    user._id,
    function (error, worklogs) {
      if (error) return next(error);
      if (!worklogs || !worklogs.length)
        return res.status(404).end();
      res.json({ worklogs: worklogs });
  });
};

exports.add = function (req, res, next) {
  var user = req.body.user;
  if (!user) return res.status(400).json({ error: "No user payload" });
  req.models.User.create(user, function (error, userResponse) {
    if (error) return next(error);
    res.json({ response: {
      message: "User successfully added.",
      data: userResponse
    }});
  });
};

exports.delete = function (req, res, next) {
  async.series({
    deleteWorklogs: function (callback) {
      deleteWorklogs(req, callback);
    },
    cleanTaskRelation: function (callback) {
      cleanTaskRelation(req, callback);
    },
    deleteUser: function (callback) {
      deleteUser(req, callback);
    }
  }, function (error, results) {
    res.status(204).end();
  });
};

exports.authenticate = function (req, res, next) {
  // TODO
};

function deleteWorklogs (req, callback) {
  var user = req.user;

  req.models.Worklog.findByUserId(
    user.id,
    function (error, worklogs) {
      if (error) return callback(error);
      worklogs.forEach(function (worklog) {
        worklog.remove(function (error, doc) {
          if (error) return callback(error);
          callback(null, "Worklog removed: " + doc);
        });
      });
  });
};

function cleanTaskRelation (req, callback) {
  var user = req.user;

  req.models.Task.findByUserId(
    user.id,
    function (error, tasks) {
      if (error) return callback(error);
      tasks.forEach(function (task) {
        task.user = null;
        task.save(function (error, results) {
          if (error) return callback(error);
          callback(null, "Relation between task " + task + " and user " + user + " removed.");
        });
      });
  });
};

function deleteUser (req, callback) {
  var user = req.user;

  user.remove(function (error, doc) {
    if (error) return callback(error);
    callback(null, "User removed: " + doc);
  });
};
