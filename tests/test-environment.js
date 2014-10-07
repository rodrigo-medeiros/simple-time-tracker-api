var Task = require('../models').Task,
    WorkLog = require('../models').WorkLog,
    User = require('../models').User,
    ObjectId = require('mongoose').Types.ObjectId,
    moment = require('moment');

function createTaskWithWorkLog () {
  createUser();

  User.findOne({
    firstName: 'Arya'
  }, function (error, user) {

    var task = new Task({
      name: 'Make something',
      description: "Make sure it's something useful",
      status: 'Open',
      worklogs: [ new ObjectId ],
      user: user._id
    });

    task.save(function (error) {
      if (error) return error;
      createWorkLog(task);
    });
  });
}

function createWorkLog (task) {
   var log = new WorkLog({
    _id: task.worklogs[0],
    startedAt: moment('2014-01-01 09:05').toDate(),
    timeSpent: 3600,
    task: task._id
  });

  log.save(function (error) {
    if (error) return error;
  });
}

function createUser (isAdmin) {
  var user = new User({
    firstName: 'Arya',
    lastName: 'Stark',
    email: 'arya@winterfell.com',
    password: '1234',
    admin: isAdmin || false
  });

  user.save(function (error) {
    if (error) return error;
  });
}

exports.cleanDb = function () {
  Task.remove({}).exec();
  WorkLog.remove({}).exec();
}

exports.createUser = createUser;
exports.createTaskWithWorkLog = createTaskWithWorkLog;
exports.createWorkLog = createWorkLog;
