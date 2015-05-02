'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('timeout', function() {
  var timeout;
  var func;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    func = sinon.spy();

    timeout = require('../../lib/utils/timeout');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should defer execution until the delay has passed', function(done) {
    timeout(func, 0);

    expect(func).not.to.have.been.called;

    setTimeout(function() {
      expect(func).to.have.been.called;
      done();
    }, 0);
  });
});
