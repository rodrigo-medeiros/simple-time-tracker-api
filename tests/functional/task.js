var boot = require('../../app').boot,
    shutdown = require('../../app').shutdown,
    port = require('../../app').port,
    models = require('../../models'),
    environment = require('./../test-environment'),
    url = require('url'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment');

describe('Tasks GET routes', function () {
  before(function () {
    boot();
    environment.cleanDb();
  });
  describe('/api/task/:id', function () {
    before(function () {
      environment.createTaskWithWorkLog();
    });
    var URL = url.format({
      protocol: 'http',
      hostname: 'localhost',
      port: 3000,
      pathname: 'api/task/5210a64f846cb004b5000001'
    });
    it('should respond 404', function (done) {
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
