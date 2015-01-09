var boot = require('../app').boot,
    shutdown = require('../app').shutdown,
    port = require('../app').port,
    models = require('../models'),
    environment = require('./test-environment'),
    url = require('url'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment'),
    async = require('async');

var URL = {
  protocol: 'http',
  hostname: 'localhost',
  port: 3000,
};

describe('Task routes', function () {
  before(function (done) {
    boot(done);
  });
  beforeEach(function (done) {
    async.series({
      cleanDb: function (callback) {
        environment.cleanDb(callback);
      },
      createTaskWithWorklog: function (callback) {
        environment.createTaskWithWorklog(callback);
      }
    }, function (error, results) {
      if (error) throw new Error(error);
      done();
    });
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

  describe('/api/task/:task_id (GET)', function () {

    it('should respond 404 to GET', function (done) {
      URL.pathname = 'api/task/5210a64f846cb004b5000001';

      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should respond 200 to GET', function (done) {
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


    it('should return the task when GET', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task._id;
        superagent
          .get(URL)
          .end(function (res) {
            var task = res.body.task;
            expect(task).to.only.have.keys('id', 'description', 'user', 'status', 'name', 'worklogs');
            done();
          });
      });
    });

    it('should have a user attribute when GET', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task._id;
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
  });

  describe('/api/task/:task_id (DEL)', function () {

    it('should respond 404 to DEL', function (done) {
        URL.pathname = 'api/task/5210a64f846cb004b5000001';
        superagent
          .del(URL)
          .end(function (res) {
            expect(res.status).to.equal(404);
            done();
        });
    });

    it('should delete the task successfully', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task.id;
        superagent
          .del(URL)
          .end(function (res) {
            expect(res.status).to.equal(204);

            async.series({
              checkWorklogs: function (callback) {
                models.Worklog.findByTaskId(
                  task.id,
                  function (error, worklogs) {
                    if (error) return callback(error);
                    expect(worklogs).to.be.empty();
                    callback(null, "Worklogs deleted.");
                });
              },
              checkTask: function (callback) {
                models.Task.findById(
                  task.id,
                  function (error, task) {
                    if (error) return callback(error);
                    expect(task).to.be(null);
                    callback(null, "Task deleted.");
                });
              }
            }, function (error, results) {
              done();
            });
        });
      });
    });
  });

  describe('/api/task/:task_id/worklog (POST)', function () {

    it('should respond 400 to POST', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task._id + '/worklog';

        superagent
          .post(URL)
          .end(function (res) {
            expect(res.status).to.equal(400);
            done();
          });
      });
    });

    it('should respond 200 to POST', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
      URL.pathname = 'api/task/' + task._id + '/worklog';
      var worklog = {
        startedAt: moment('2014-01-01 13:05').toDate(),
        timeSpent: 1800
      };

      superagent
        .post(URL)
        .send({ worklog: worklog })
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    it('should insert a worklog successfully', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
      URL.pathname = 'api/task/' + task._id + '/worklog';
      var worklog = {
        startedAt: moment('2014-01-01 13:05').toDate(),
        timeSpent: 1800,
        task: task._id,
        user: task.user
      };

      superagent
        .post(URL)
        .send({ worklog: worklog })
        .end(function (res) {
          var worklogResponse = res.body.response;
          expect(worklogResponse.message).to.equal("Worklog successfully added.");
          expect(worklogResponse.data).to.only.have.keys('id', 'startedAt', 'timeSpent', 'task', 'user');
          done();
        });
      });
    });
  });

  describe('/api/task/:task_id/worklog (GET)', function () {

    it('should respond 404 when GET', function (done) {
      URL.pathname = 'api/task/5210a64f846cb004b5000001/worklog';
      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
      });
    });

    it('should respond 200 when GET', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task._id + '/worklog';
        superagent
          .get(URL)
          .end(function (res) {
            expect(res.status).to.equal(200);
            done();
        });
      });
    });

    it('should return one worklog when GET', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task._id + '/worklog';
        superagent
          .get(URL)
          .end(function (res) {
            var worklogs = res.body.worklogs;

            expect(worklogs).to.have.length(1);

            var worklog = worklogs[0];

            expect(worklog).to.be.ok();
            expect(worklog).to.only.have.keys('id', 'startedAt', 'timeSpent');
            done();
        });
      });
    });

  });

  describe('/api/task/:task_id/worklog/:worklog_id (GET)', function () {

    it('should respond 404 when GET', function (done) {
      URL.pathname = 'api/task/5210a64f846cb004b5000001/worklog/5210a64f846cb004b5000001';
      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
      });
    });

    it('should respond 200 when GET', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task._id + '/worklog/' + task.worklogs[0];
        superagent
          .get(URL)
          .end(function (res) {
            expect(res.status).to.equal(200);
            done();
        });
      });
    });

    it('should return one worklog when GET', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        URL.pathname = 'api/task/' + task._id + '/worklog/' + task.worklogs[0];
        superagent
          .get(URL)
          .end(function (res) {
            var worklog = res.body.worklog;
            expect(worklog).to.be.ok();
            expect(worklog).to.only.have.keys('id', 'startedAt', 'timeSpent');
            done();
        });
      });
    });
  });

  describe('/api/task/:task_id/worklog/:worklog_id (DEL)', function () {

    it('should respond 404 to DEL', function (done) {
      URL.pathname = 'api/task/5210a64f846cb004b5000001/worklog/5210a64f846cb004b5000001';
      superagent
        .del(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should delete a worklog successfully', function (done) {
      models.Task.findOne({ status: 'Open' }, function (error, task) {
        if (error) return next(error);

        URL.pathname = 'api/task/' + task.id + '/worklog/' + task.worklogs[0];

        superagent
          .del(URL)
          .end(function (res) {
            expect(res.status).to.equal(204);
            done();
          });
      });
    });
  });

  after(function (done) {
    shutdown();
    environment.cleanDb(done);
  });
});
