var Task = require('../models').Task,
    TimeLog = require('../models').TimeLog,
    ObjectId = require('mongoose').Types.ObjectId,
    moment = require('moment');

exports.createTaskWithTimeLog = function () {
  var task = new Task({
    name: 'Make something',
    description: "Make sure it's something useful",
    status: 'Open',
    worklogs: [ new ObjectId ]
  });

  task.save(function (error) {
    if (error) return error;

    var log = new TimeLog({
      _id: task.worklogs[0],
      startedAt: moment('2014-01-01 09:05').toDate(),
      stopedAt: moment('2014-01-01 09:15').toDate(),
      task: task._id
    });

    log.save(function (error) {
      if (error) return error;
    });
  });
}

exports.cleanDb = function () {
  Task.remove({}).exec();
  TimeLog.remove({}).exec();
}
