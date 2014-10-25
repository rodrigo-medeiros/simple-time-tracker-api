var boot = require('../app').boot,
    shutdown = require('../app').shutdown,
    port = require('../app').port,
    models = require('../models'),
    environment = require('./test-environment'),
    url = require('url'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment');

var URL = {
  protocol: 'http',
  hostname: 'localhost',
  port: 3000,
};

describe('Task GET routes', function () {
  before(function () {
    boot();
    environment.cleanDb();
    environment.createTaskWithWorkLog();
  });
  describe('/api/task/:name', function () {

    it('should respond 404', function (done) {
      URL.pathname = 'api/task/not a valid task'

      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should respond 200', function (done) {
      URL.pathname = 'api/task/' + 'Kill the Lannisters';
      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should return one task', function (done) {
      URL.pathname = 'api/task/' + 'Kill the Lannisters';
      superagent
        .get(URL)
        .end(function (res) {
          var task = res.body.task;
          expect(task).to.only.have.keys('description', 'user', 'status', 'name');
          done();
        });
    });
  });

  after(function () {
    shutdown();
    environment.cleanDb();
  });
});
