var Task = require('../models').Task,
    Worklog = require('../models').Worklog,
    User = require('../models').User,
    ObjectId = require('mongoose').Types.ObjectId,
    moment = require('moment'),
    async = require('async');

function createTaskWithWorklog (done) {
  var task = new Task({
    name: 'Kill the Lannisters',
    description: "Make sure Cersei is the first.",
    status: 'Open',
    worklogs: [ new ObjectId() ],
    user: new ObjectId()
  });

  async.series({
    createTask: function (callback) {
      task.save(callback);
    },
    createUser: function (callback) {
      createUser(false, task, callback);
    },
    createWorklog: function (callback) {
      createWorklog(task, callback);
    }
  }, function (error, results) {
    if (error) throw new Error(error);
    done();
  });
}

function createWorklog (task, callback) {
  var log = new Worklog({
    _id: task.worklogs[0],
    startedAt: moment('2014-01-01 09:00').toDate(),
    timeSpent: 3600,
    task: task._id,
    user: task.user
  });

  log.save(callback);
}

function createUser (isAdmin, task, callback) {
  var user = new User({
    _id: task.user,
    firstName: 'Arya',
    lastName: 'Stark',
    username: 'aryastark',
    email: 'arya@winterfell.com',
    password: '1234',
    admin: isAdmin || false
  });

  user.save(callback);
}

exports.cleanDb = function (done) {
  async.series({
    removeTask: function (callback) {
      Task.remove({}).exec(callback);
    },
    removeWorklog: function (callback) {
      Worklog.remove({}).exec(callback);
    },
    removeUser: function (callback) {
      User.remove({}).exec(callback);
    },
  }, function (error, results) {
    if (error) throw new Error(error);
    done();
  });
};

exports.createTaskWithWorklog = createTaskWithWorklog;
exports.createWorklog = createWorklog;
exports.createUser = createUser;
