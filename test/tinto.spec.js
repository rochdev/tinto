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
  var around;
  var callback;
  var wrapper;
  var step;
  var stepSpy;
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
    around = sinon.stub();

    world = {
      Given: given,
      When: given,
      Then: given,
      Before: before,
      After: after,
      Around: around
    };

    promise = Q.resolve('test');

    queue.process.returns(promise);

    mockery.registerMock('./queue', queue);

    tinto = require('../lib/tinto');

    callback = sinon.spy();
    wrapper = tinto(function() {});
    stepSpy = sinon.spy();
    step = function() {stepSpy();};

    wrapper.call(world);
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should wrap Cucumber given step definition method', function() {
    world.Given('foo', 'bar', step);

    return assert(given);
  });

  it('should wrap Cucumber when step definition method', function() {
    world.When('foo', 'bar', step);

    return assert(given);
  });

  it('should wrap Cucumber then step definition method', function() {
    world.Then('foo', 'bar', step);

    return assert(given);
  });

  it('should wrap Cucumber before hook', function() {
    world.Before('foo', 'bar', step);

    return assert(before);
  });

  it('should wrap Cucumber after hook', function() {
    world.After('foo', 'bar', step);

    return assert(after);
  });

  it('should wrap Cucumber around hook', function() {
    world.Around('foo', 'bar', step);

    return assert(around);
  });

  it('should not wrap the same world multiple times', function() {
    var Given = world.Given;
    var When = world.When;
    var Then = world.Then;
    var Before = world.Before;
    var After = world.After;
    var Around = world.Around;

    tinto(function() {}).call(world);

    expect(Given).to.equal(world.Given);
    expect(When).to.equal(world.When);
    expect(Then).to.equal(world.Then);
    expect(Before).to.equal(world.Before);
    expect(After).to.equal(world.After);
    expect(Around).to.equal(world.Around);
  });

  function assert(method) {
    expect(method).to.have.been.calledWith('foo', 'bar');

    var stepPromise = method.firstCall.args[2]();

    expect(stepSpy).to.have.been.called;
    expect(queue.process).to.have.been.called;
    expect(stepPromise).to.equal(promise);
  }
});
