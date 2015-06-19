'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;

describe('wait', function() {
  var runnable;
  var wait;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    wait = require('../../lib/utils/wait');

    runnable = sinon.stub();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should eventually resolve true when the runnable returns true', function() {
    runnable.returns(Q.resolve({outcome: true}));

    return wait.until(runnable, false).then(function(results) {
      expect(results[0].outcome).to.be.true;
    });
  });

  it('should eventually resolve false when the runnable returns false', function() {
    runnable.returns(Q.resolve({outcome: false}));

    return wait.for(0).every(0).until(runnable, false).then(function(results) {
      expect(results[0].outcome).to.be.false;
    });
  });

  it('should retry until the runnable returns true', function() {
    runnable.onCall(0).returns(Q.resolve({outcome: false}));
    runnable.onCall(1).returns(Q.resolve({outcome: true}));

    return wait.for(5).every(0).until(runnable, false).then(function(results) {
      expect(results[0].outcome).to.be.true;
    });
  });

  it('should rethrow if the runnable throws an exception', function() {
    runnable.throws(new Error());

    expect(function() {
      wait.for(0).every(0).until(runnable, false);
    }).to.throw();
  });

  it('should not retry if the total time has elapsed', function(done) {
    var timeout = sinon.spy();

    mockery.resetCache();
    mockery.registerMock('./timeout', timeout);

    wait = require('../../lib/utils/wait');

    runnable.returns(Q.resolve({outcome: false}));

    wait.for(5).every(0).until(runnable, false).then(function(results) {
      expect(results[0].outcome).to.be.false;
      done();
    });

    setTimeout(function() {
      timeout.firstCall.args[0]();
    }, 0);
  });

  it('should wait for the assertion to finish even if the total time has elapsed', function() {
    var deferred = Q.defer();

    runnable.returns(deferred.promise);

    setTimeout(function() {
      deferred.resolve({outcome: false});
    }, 1);

    return wait.for(0).every(0).until(runnable, false).then(function(results) {
      expect(results).to.exist;
    });
  });

  it('should support multiple results', function() {
    runnable.returns(Q.resolve([
      {outcome: true},
      {outcome: true}
    ]));

    return wait.until(runnable, false).then(function(results) {
      expect(results[0].outcome).to.be.true;
      expect(results[1].outcome).to.be.true;
    });
  });
});
