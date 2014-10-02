var boot = require('../../app').boot,
    shutdown = require('../../app').shutdown,
    port = require('../../app').port,
    models = require('../../models'),
    environment = require('./../test_environment'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment');

describe('Server', function () {
  before(function () {
    boot();
    environment.cleanDb();
  });
  describe('Homepage', function () {
    before(function () {
      environment.createTaskWithTimeLog();
    })
    it('should respond to GET', function (done) {
      superagent
        .get('http://localhost:' + port + '/tasks')
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should return a task when responding to GET', function (done) {
      superagent
        .get('http://localhost:' + port + '/tasks')
        .end(function (res) {
          var tasks = res.body.tasks;
          expect(tasks).to.have.length(1);
          expect(tasks[0]).to.have.keys('name', 'description', 'status', 'logs');
          expect(tasks[0].logs).to.have.length(1);
          expect(tasks[0].logs[0]).to.have.keys('startedAt', 'stopedAt', 'task');
          done();
        });
    });
  });
  after(function () {
    shutdown();
  });
});
