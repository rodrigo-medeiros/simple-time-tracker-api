var boot = require('../../app').boot,
    shutdown = require('../../app').shutdown,
    port = require('../../app').port,
    models = require('../../models'),
    environment = require('./../test-environment'),
    url = require('url'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment');

describe('Tasks routes', function () {
  before(function () {
    boot();
    environment.cleanDb();
  });
  describe('GET', function () {
    before(function () {
      environment.createTaskWithWorkLog();
    });
    var URL = url.format({
      protocol: 'http',
      hostname: 'localhost',
      port: 3000,
      pathname: 'api/tasks'
    });
    it('should respond 200', function (done) {
      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should return a task with one worklog', function (done) {
      superagent
        .get(URL)
        .end(function (res) {
          var tasks = res.body.tasks;
          expect(tasks).to.have.length(1);
          expect(tasks[0]).to.have.keys('name', 'description', 'status', 'worklogs', 'user');
          expect(tasks[0].worklogs).to.have.length(1);
          expect(tasks[0].worklogs[0]).to.have.keys('startedAt', 'timeSpent', 'task');
          done();
        });
    });
  });
  after(function () {
    shutdown();
    environment.cleanDb();
  });
});
