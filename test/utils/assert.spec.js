'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;
var assert = rewire('../../lib/utils/assert');
var AssertionResult = require('../../lib/assertion-result');

describe('assert', function() {
  var assertable;
  var callback;
  var chai;
  var context;
  var queue;
  var utils;
  var matcher;
  var wait;

  beforeEach(function() {
    chai = {
      use: function(plugin) {
        plugin(this, utils);
      }
    };

    utils = sinon.stub({
      flag: function() {}
    });

    queue = sinon.stub({
      push: function() {}
    });

    assertable = sinon.stub({
      equals: function() {}
    });

    callback = sinon.stub();

    context = sinon.stub({
      assert: function() {}
    });

    wait = sinon.stub({
      until: function() {}
    });

    matcher = sinon.stub();

    assert.__set__('chai', chai);
    assert.__set__('queue', queue);
    assert.__set__('wait', wait);
  });

  it('should assert a false result', function() {
    return test(false, false, false);
  });

  it('should assert a true result', function() {
    return test(true, false, false);
  });

  it('should assert a false result when negated', function() {
    return test(false, true, false);
  });

  it('should assert a true result when negated', function() {
    return test(true, true, false);
  });

  it('should assert a false result when waiting', function() {
    wait.until.returns(Q.resolve(new AssertionResult(false, 'bar')));

    return test(false, false, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, false);
    });
  });

  it('should assert a true result when waiting', function() {
    wait.until.returns(Q.resolve(new AssertionResult(true, 'bar')));

    return test(true, false, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, false);
    });
  });

  it('should assert a false result when negated and waiting', function() {
    wait.until.returns(Q.resolve(new AssertionResult(false, 'bar')));

    return test(false, true, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, true);
    });
  });

  it('should assert a true result when negated and waiting', function() {
    wait.until.returns(Q.resolve(new AssertionResult(true, 'bar')));

    return test(true, true, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, true);
    });
  });

  it('should delegate the actual assertion when using the `delegate` flag', function() {
    callback.withArgs(assertable).returns(matcher.returns(Q.resolve(new AssertionResult(true, 'bar'))));
    utils.flag.withArgs(context, 'delegate').returns(true);

    var delegator = assert('value', callback, 'have #{name} #{exp} but was #{act}').call(context, 'foo');

    expect(queue.push).not.to.have.been.called;

    delegator(assertable);

    expect(queue.push).to.have.been.called;

    return queue.push.firstCall.args[0]().then(function() {
      expect(context.assert).to.have.been.calledWith(
        true, buildMessage(false, false), buildMessage(true, false), 'foo', 'bar', true
      );
    });
  });

  function test(result, negate, eventually) {
    callback.withArgs(assertable).returns(matcher.returns(Q.resolve(new AssertionResult(result, 'bar'))));

    utils.flag.withArgs(context, 'negate').returns(negate);
    utils.flag.withArgs(context, 'eventually').returns(eventually);
    utils.flag.withArgs(context, 'object').returns(assertable);

    assert('value', callback, 'have #{name} #{exp} but was #{act}').call(context, 'foo');

    expect(queue.push).to.have.been.called;

    return queue.push.firstCall.args[0]().then(function() {
      expect(context.assert).to.have.been.calledWith(
        result, buildMessage(false, eventually), buildMessage(true, eventually), 'foo', 'bar', !negate
      );
    });
  }

  function buildMessage(not, eventually) {
    var message = ['expected #{this}'];

    if (not) {
      message.push('not');
    }

    message.push('to');

    if (eventually) {
      message.push('eventually');
    }

    message.push('have value #{exp} but was #{act}');

    return message.join(' ');
  }
});
