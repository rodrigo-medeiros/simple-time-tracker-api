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

describe('Worklog GET routes', function () {
  before(function () {
    boot();
    environment.cleanDb();
    environment.createTaskWithWorklog();
  });
  describe('/api/worklog/:id', function () {

    it('should respond 404', function (done) {
      URL.pathname = 'api/worklog/' + '5210a64f846cb004b5000001';

      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
      });
    });

    it('should respond 200', function (done) {
      models.Worklog.findOne({ timeSpent: 3600 }, function (error, worklog) {
        URL.pathname = 'api/worklog/' + worklog._id;

        superagent
          .get(URL)
          .end(function (res) {
            expect(res.status).to.equal(200);
            done();
        });
      });
    });

    it('should return a worklog', function (done) {
      models.Worklog.findOne({ timeSpent: 3600 }, function (error, worklog) {
        URL.pathname = 'api/worklog/' + worklog._id;

        superagent
          .get(URL)
          .end(function (res) {
            var worklog = res.body.worklog;

            expect(worklog).to.be.ok();
            expect(worklog).to.only.have.keys('id', 'startedAt', 'timeSpent', 'task');
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
