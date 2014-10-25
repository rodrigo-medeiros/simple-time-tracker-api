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

  describe('api/user/:id', function () {

    it('should respond 404', function (done) {
      URL.pathname = 'api/user/5210a64f846cb004b5000001';

      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should respond 200', function (done) {
      models.User.findOne({ username: 'aryastark' }, function (error, user) {
        URL.pathname = 'api/user/' + user._id;

        superagent
         .get(URL)
         .end(function (res) {
           expect(res.status).to.equal(200);
           done();
         });
      });
    });

    it('should return a user', function (done) {
      models.User.findOne({ username: 'aryastark' }, function (error, user) {
        URL.pathname = 'api/user/' + user._id;

        superagent
         .get(URL)
         .end(function (res) {
           var user = res.body.user;
           expect(user).to.be.ok();
           expect(user).to.have.keys('firstName', 'lastName', 'username', 'email', 'admin');
           done();
         });
      });
    });
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

    it('should respond 200', function (done) {
      models.User.findOne({ username: 'aryastark' }, function (error, user) {
        URL.pathname = 'api/user/' + user._id + '/tasks';

        superagent
          .get(URL)
          .end(function (res) {
            expect(res.status).to.equal(200);
            done();
        });
      });
    });

    it('should return a task', function (done) {
      models.User.findOne({ username: 'aryastark' }, function (error, user) {
        URL.pathname = 'api/user/' + user._id + '/tasks';

        superagent
          .get(URL)
          .end(function (res) {
            var tasks = res.body.tasks;

            expect(tasks).to.not.be.empty();
            expect(tasks).to.have.length(1);

            var task = tasks[0];

            expect(task).to.only.have.keys('name', 'description', 'status', 'user');
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
