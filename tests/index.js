var boot = require('../app').boot,
    shutdown = require('../app').shutdown,
    port = require('../app').port,
    models = require('../models'),
    environment = require('./test_environment'),
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


