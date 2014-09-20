var boot = require('../app').boot,
    shutdown = require('../app').shutdown,
    port = require('../app').port,
    superagent = require('superagent'),
    expect = require('expect.js'),
    moment = require('moment');

describe('Server', function () {
  before(function () {
    boot();
  });
  describe('Homepage', function () {
    before(function () {

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
