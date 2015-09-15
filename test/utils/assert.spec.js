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
  var flag;
  var context;
  var queue;
  var matcher;
  var wait;

  beforeEach(function() {
    flag = sinon.stub();

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

    assert.__set__('flag', flag);
    assert.__set__('queue', queue);
    assert.__set__('wait', wait);
  });

  it('should assert a false result', function() {
    wait.until.returns(Q.resolve(new AssertionResult(false, 'foo', 'bar')));

    return test(false, false).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, false);
    });
  });

  it('should assert a true result', function() {
    wait.until.returns(Q.resolve(new AssertionResult(true, 'foo', 'bar')));

    return test(true, false).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, false);
    });
  });

  it('should assert a false result when negated', function() {
    wait.until.returns(Q.resolve(new AssertionResult(false, 'foo', 'bar')));

    return test(false, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, true);
    });
  });

  it('should assert a true result when negated', function() {
    wait.until.returns(Q.resolve(new AssertionResult(true, 'foo', 'bar')));

    return test(true, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, true);
    });
  });

  it('should delegate the actual assertion when using the `delegate` flag', function() {
    callback.withArgs(assertable).returns(matcher);
    wait.until.withArgs(matcher).returns(Q.resolve(new AssertionResult(true, 'foo', 'bar')));
    flag.withArgs(context, 'delegate').returns(true);

    var delegator = assert('value', callback, 'have #{name} #{exp} but was #{act}').call(context, 'foo');

    expect(queue.push).not.to.have.been.called;

    delegator.call(context, assertable);

    expect(queue.push).to.have.been.called;

    return queue.push.firstCall.args[0]().then(function() {
      expect(context.assert).to.have.been.calledWith(
        true, buildMessage(false), buildMessage(true), 'foo', 'bar', true
      );
    });
  });

  it('should support multiple results', function() {
    callback.withArgs(assertable).returns(matcher);
    wait.until.withArgs(matcher).returns(Q.all([
      Q.resolve(new AssertionResult(true, 'foo', 'bar')),
      Q.resolve(new AssertionResult(false, 'baz', 'qux'))
    ]));

    flag.withArgs(context, 'object').returns(assertable);

    assert('value', callback, 'have #{name} #{exp} but was #{act}').call(context, 'foo', 'bar');

    expect(queue.push).to.have.been.called;

    return queue.push.firstCall.args[0]().then(function() {
      expect(callback).to.have.been.calledWith(assertable, 'foo', 'bar');
      expect(context.assert).to.have.been.calledWith(
        true, buildMessage(false), buildMessage(true), 'foo', 'bar', true
      );
      expect(context.assert).to.have.been.calledWith(
        false, buildMessage(false), buildMessage(true), 'baz', 'qux', true
      );
    });
  });

  function test(result, negate) {
    callback.withArgs(assertable).returns(matcher.returns(Q.resolve(new AssertionResult(result, 'foo', 'bar'))));

    flag.withArgs(context, 'negate').returns(negate);
    flag.withArgs(context, 'object').returns(assertable);

    assert('value', callback, 'have #{name} #{exp} but was #{act}').call(context, 'foo');

    expect(queue.push).to.have.been.called;

    return queue.push.firstCall.args[0]().then(function() {
      expect(callback).to.have.been.calledOn(context);
      expect(context.assert).to.have.been.calledWith(
        result, buildMessage(false), buildMessage(true), 'foo', 'bar', !negate
      );
    });
  }

  function buildMessage(not) {
    var message = ['expected', context.toString()];

    if (not) {
      message.push('not');
    }

    message.push('to have value #{exp} but was #{act}');

    return message.join(' ');
  }
});
