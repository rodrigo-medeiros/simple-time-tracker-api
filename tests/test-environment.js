var Task = require('../models').Task,
    WorkLog = require('../models').WorkLog,
    User = require('../models').User,
    ObjectId = require('mongoose').Types.ObjectId,
    moment = require('moment');

function createTaskWithWorkLog () {
  var task = new Task({
    name: 'Kill the Lannisters',
    description: "Make sure Cersei is the first.",
    status: 'Open',
    worklogs: [ new ObjectId ],
    user: new ObjectId
  });

  task.save(function (error) {
    if (error) return error;
    createWorkLog(task);
    createUser(false, task);
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

function createUser (isAdmin, task) {
  var user = new User({
    _id: task.user,
    firstName: 'Arya',
    lastName: 'Stark',
    username: 'aryastark',
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
  User.remove({}).exec();
}

exports.createTaskWithWorkLog = createTaskWithWorkLog;
exports.createWorkLog = createWorkLog;
exports.createUser = createUser;
