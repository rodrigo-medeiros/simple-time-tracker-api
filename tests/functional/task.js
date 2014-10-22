var boot = require('../../app').boot,
    shutdown = require('../../app').shutdown,
    port = require('../../app').port,
    models = require('../../models'),
    environment = require('./../test-environment'),
    url = require('url'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment');

var URL = {
  protocol: 'http',
  hostname: 'localhost',
  port: 3000,
};

describe('Tasks GET routes', function () {
  before(function () {
    boot();
    environment.cleanDb();
  });
  describe('/api/task/:id', function () {
    before(function () {
      environment.createTaskWithWorkLog();
    });
    it('should respond 404', function (done) {
      URL.pathname = 'api/task/5210a64f846cb004b5000001'

      superagent
        .get(url.format(URL))
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should respond 200', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task._id;

        superagent
          .get(URL)
          .end(function (res) {
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
  });
  after(function () {
    shutdown();
    environment.cleanDb();
  });
});
