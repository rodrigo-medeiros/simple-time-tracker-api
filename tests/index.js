var boot = require('../app').boot,
    shutdown = require('../app').shutdown,
    port = require('../app').port,
    models = require('../models'),
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment');

describe('Server', function () {
  before(function () {
    boot();
    models.Task.remove({}).exec();
  });
  describe('Homepage', function () {
    before(function () {
      var task = {
        name: 'Make something',
        description: "Make sure it's something useful",
        status: 'Open'
      };
      models.Task.create(task, function (error, taskResponse) {
        if (error) return error;
      });
    });
    it('should respond to GET', function (done) {
      superagent
        .get('http://localhost:' + port)
        .end(function (res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
  after(function () {
    shutdown();
  });
});
