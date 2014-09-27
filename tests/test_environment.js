var Task = require('../models').Task,
    TimeLog = require('../models').TimeLog,
    moment = require('moment');

exports.createTaskWithTimeLog = function () {
  var log = {
    startedAt: moment('2014-01-01 09:05').toDate(),
    stopedAt: moment('2014-01-01 09:15').toDate()
  };
  TimeLog.create(log, function (error, timeLogResponse) {
    if (error) return error;
    var task = {
      name: 'Make something',
      description: "Make sure it's something useful",
      status: 'Open',
      timeLogs: []
    };
    Task.create(task, function (error, taskResponse) {
      if (error) return error;
      taskResponse.timeLogs.push(timeLogResponse);
      taskResponse.save();
      timeLogResponse.task = taskResponse;
      timeLogResponse.save();
    });
  });
}

exports.cleanDb = function () {
  Task.remove({}).exec();
  TimeLog.remove({}).exec();
}

