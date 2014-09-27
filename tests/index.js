var boot = require('../app').boot,
    shutdown = require('../app').shutdown,
    port = require('../app').port,
    models = require('../models'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment');

describe('Server', function () {
  before(function () {
    boot();
    cleanDb();
  });
  describe('Homepage', function () {
    before(function () {
      createTaskWithTimeLog();
    })
    it('should respond to GET', function (done) {
      superagent
        .get('http://localhost:' + port)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should return a task when responding to GET', function (done) {
      superagent
        .get('http://localhost:' + port)
        .end(function (res) {
          expect(JSON.parse(res.body)[0]).to.have.keys('name', 'description', 'status', 'timeLogs');
          done();
        });
    });
  });
  after(function () {
    shutdown();
  });
});

function createTaskWithTimeLog() {
  var log = {
    startedAt: moment('2014-01-01 09:05').toDate(),
    stopedAt: moment('2014-01-01 09:15').toDate()
  };
  models.TimeLog.create(log, function (error, timeLogResponse) {
    if (error) return error;
    var task = {
      name: 'Make something',
      description: "Make sure it's something useful",
      status: 'Open',
      timeLogs: []
    };
    models.Task.create(task, function (error, taskResponse) {
      if (error) return error;
      taskResponse.timeLogs.push(timeLogResponse);
      taskResponse.save();
      timeLogResponse.task = taskResponse;
      timeLogResponse.save();
    });
  });
}

function cleanDb() {
  models.Task.remove({}).exec();
  models.TimeLog.remove({}).exec();
}

