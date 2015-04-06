'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;
var Q = require('q');
var tinto = rewire('../lib/tinto');

describe('tinto', function() {
  var queue;
  var world;
  var given;
  var when;
  var then;
  var promise;

  beforeEach(function() {
    queue = sinon.stub({process: function() {}});
    given = sinon.stub();
    when = sinon.stub();
    then = sinon.stub();

    world = {
      Given: given,
      When: when,
      Then: then
    };

    promise = Q.resolve();

    queue.process.returns(promise);

    tinto.__set__('queue', queue);
  });

  it('should wrap Cucumber step definition methods', function() {
    var callback = sinon.spy();
    var wrapper = tinto(function() {});
    var step = sinon.spy();

    wrapper.call(world);

    world.Given('step', step);

    expect(given).to.have.been.called;

    given.firstCall.args[1](callback);

    expect(step).to.have.been.called;
    expect(queue.process).to.have.been.called;

    return promise.then(function() {
      expect(callback).to.have.been.called;
    });
  });
});
