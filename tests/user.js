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

describe('User GET routes', function () {
  before(function () {
    boot();
    environment.cleanDb();
    environment.createTaskWithWorkLog();
  });

  describe('api/user/:id/tasks', function () {

    it('should respond 404', function (done) {
      URL.pathname = 'api/user/5210a64f846cb004b5000001/tasks';

      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  after(function () {
    shutdown();
    environment.cleanDb();
  });
});
