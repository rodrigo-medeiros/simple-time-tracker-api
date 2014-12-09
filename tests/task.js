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

describe('Task routes', function () {
  before(function () {
    boot();
    environment.cleanDb();
    environment.createTaskWithWorklog();
  });

  describe('/api/task (POST)', function () {
     it('should respond 400 to POST', function (done) {
      URL.pathname = 'api/task';

      superagent
        .post(URL)
        .end(function (res) {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should respond 200 to POST', function (done) {
      URL.pathname = 'api/task';
      models.User.findByUsername('aryastark', function (error, user) {
        var task = {
          name: 'Find John Snow',
          description: '',
          user: user.id
        };
        superagent
          .post(URL)
          .send({ task: task })
          .end(function (res) {
            expect(res.status).to.equal(200);
            done();
          });
      });
    });

    it('should insert a task successfully', function (done) {
      URL.pathname = 'api/task';
      models.User.findByUsername('aryastark', function (error, user) {
        var task = {
          name: 'Go to Bravos',
          description: 'I need to learn how to became a killer.',
          user: user.id
        };
        superagent
          .post(URL)
          .send({ task: task })
          .end(function (res) {
            var taskResponse = res.body.response;
            expect(taskResponse.message).to.be.equal("Task successfully added.");
            expect(taskResponse.data).to.only.have.keys('id', 'name', 'description', 'status', 'user', 'worklogs');
            done();
          });
      });
    });
  });

  describe('/api/task/:name (GET)', function () {

    it('should respond 404 to GET', function (done) {
      URL.pathname = 'api/task/not a valid task'

      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should respond 200 to GET', function (done) {
      URL.pathname = 'api/task/' + 'Kill the Lannisters';
      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });


    it('should return one task when GET', function (done) {
      URL.pathname = 'api/task/' + 'Kill the Lannisters';
      superagent
        .get(URL)
        .end(function (res) {
          var task = res.body.task;
          expect(task).to.only.have.keys('id', 'description', 'user', 'status', 'name', 'worklogs');
          done();
        });
    });

    it('should have a user attribute when GET', function (done) {
      URL.pathname = 'api/task/' + 'Kill the Lannisters';
      superagent
        .get(URL)
        .end(function (res) {
          var user = res.body.task.user;

          expect(user).to.be.ok();
          expect(user).to.only.have.keys('id', 'username');
          done();
      });
    });
  });

  describe('/api/task/:name/worklogs (GET)', function () {

    it('should respond 404 when GET', function (done) {
      URL.pathname = 'api/task/not a valid name/worklogs';
      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
      });
    });

    it('should respond 200 when GET', function (done) {
      URL.pathname = 'api/task/Kill the Lannisters/worklogs';
      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
      });
    });

    it('should return one worklog when GET', function (done) {
      URL.pathname = 'api/task/Kill the Lannisters/worklogs';
      superagent
        .get(URL)
        .end(function (res) {
          var worklogs = res.body.worklogs;

          expect(worklogs).to.have.length(1);

          var worklog = worklogs[0];

          expect(worklog).to.be.ok();
          expect(worklog).to.only.have.keys('_id', 'startedAt', 'timeSpent');
          done();
      });
    });

  });

  after(function () {
    shutdown();
    environment.cleanDb();
  });
});
