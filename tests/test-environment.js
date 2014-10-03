var Task = require('../models').Task,
    WorkLog = require('../models').WorkLog,
    ObjectId = require('mongoose').Types.ObjectId,
    moment = require('moment');

exports.createTaskWithWorkLog = function () {
  var task = new Task({
    name: 'Make something',
    description: "Make sure it's something useful",
    status: 'Open',
    worklogs: [ new ObjectId ]
  });

  task.save(function (error) {
    if (error) return error;

    var log = new WorkLog({
      _id: task.worklogs[0],
      startedAt: moment('2014-01-01 09:05').toDate(),
      timeSpent: 3600,
      task: task._id
    });

    log.save(function (error) {
      if (error) return error;
    });
  });
}

exports.cleanDb = function () {
  Task.remove({}).exec();
  WorkLog.remove({}).exec();
}
