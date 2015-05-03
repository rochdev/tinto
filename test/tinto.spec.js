'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;
var Q = require('q');

describe('tinto', function() {
  var tinto;
  var queue;
  var world;
  var given;
  var before;
  var after;
  var callback;
  var wrapper;
  var step;
  var promise;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    queue = sinon.stub({process: function() {}});
    given = sinon.stub();
    before = sinon.stub();
    after = sinon.stub();

    world = {
      Given: given,
      When: given,
      Then: given,
      Before: before,
      After: after
    };

    promise = Q.resolve();

    queue.process.returns(promise);

    mockery.registerMock('./queue', queue);

    tinto = require('../lib/tinto');

    callback = sinon.spy();
    wrapper = tinto(function() {});
    step = sinon.spy();

    wrapper.call(world);
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should wrap Cucumber given step definition method', function() {
    world.Given('foo', 'bar', step);

    assert(given);
  });

  it('should wrap Cucumber when step definition method', function() {
    world.When('foo', 'bar', step);

    assert(given);
  });

  it('should wrap Cucumber then step definition method', function() {
    world.Then('foo', 'bar', step);

    assert(given);
  });

  it('should wrap Cucumber before hook', function() {
    world.Before('foo', 'bar', step);

    assert(before);
  });

  it('should wrap Cucumber after hook', function() {
    world.After('foo', 'bar', step);

    assert(after);
  });

  function assert(method) {
    expect(method).to.have.been.calledWith('foo', 'bar');

    method.firstCall.args[2](callback);

    expect(step).to.have.been.called;
    expect(queue.process).to.have.been.called;

    return promise.then(function() {
      expect(callback).to.have.been.called;
    });
  }
});
