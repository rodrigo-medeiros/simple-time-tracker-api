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

describe('User routes', function () {
  before(function () {
    boot();
    environment.cleanDb();
    environment.createTaskWithWorklog();
  });

  describe('/api/user (POST)', function () {
    it('should respond 400 to POST', function (done) {
      URL.pathname = 'api/user';

      superagent
        .post(URL)
        .end(function (res) {
          expect(res.status).to.be.equal(400);
          done();
        });
    });

    it('should respond 200 to POST', function (done) {
      URL.pathname = 'api/user';

      var user = {
        firstName: 'Tyrion',
        lastName: 'Lannister',
        username: 'tyrionlannister',
        email: 'tyrion@casterlyrock.com',
        password: 'wine&girls'
      }

      superagent
        .post(URL)
        .send({ user: user })
        .end(function (res) {
          expect(res.status).to.be.equal(200);
          done();
        });
    });

    it('should insert a user successfully', function (done) {
      URL.pathname = 'api/user';

      var user = {
        firstName: 'Tyrion',
        lastName: 'Lannister',
        username: 'tyrionlannister',
        email: 'tyrion@casterlyrock.com',
        password: 'wine&girls'
      }

      superagent
        .post(URL)
        .send({ user: user })
        .end(function (res) {
          var userResponse = res.body.response;
          expect(userResponse.message).to.be.equal("User successfully added.");
          expect(userResponse.data).to.have.keys('firstName', 'lastName', 'username', 'email', 'admin');
          done();
        });
    });
  });

  describe('/api/user/:id (get)', function () {

    it('should respond 404 to GET', function (done) {
      URL.pathname = 'api/user/5210a64f846cb004b5000001';

      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should respond 200 to GET', function (done) {
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
           expect(user).to.only.have.keys('id', 'firstName', 'lastName', 'username', 'email', 'admin');
           done();
         });
      });
    });
  });

  describe('/api/user/:id/tasks (GET)', function () {

    it('should respond 404 to GET', function (done) {
      URL.pathname = 'api/user/5210a64f846cb004b5000001/tasks';

      superagent
        .get(URL)
        .end(function (res) {
          expect(res.status).to.equal(404);
          done();
      });
    });

    it('should respond 200 to GET', function (done) {
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

    it('should return one task', function (done) {
      models.User.findOne({ username: 'aryastark' }, function (error, user) {
        URL.pathname = 'api/user/' + user._id + '/tasks';

        superagent
          .get(URL)
          .end(function (res) {
            var tasks = res.body.tasks;

            expect(tasks).to.not.be.empty();
            expect(tasks).to.have.length(1);

            var task = tasks[0];

            expect(task).to.only.have.keys('name', 'description', 'status', 'user', 'id', 'worklogs');
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
