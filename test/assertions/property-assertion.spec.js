'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;

describe('PropertyAssertion', function() {
  var chai;
  var utils;
  var context;
  var queue;
  var component;
  var matcher;
  var wait;
  var PropertyAssertion;

  beforeEach(function() {
    PropertyAssertion = rewire('../../lib/assertions/property-assertion');

    chai = {
      Assertion: {
        addMethod: sinon.spy(function(name, callback) {
          return callback.call(context, 'value');
        })
      },
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

    component = sinon.stub({
      has: function() {}
    });

    context = sinon.stub({
      assert: function() {}
    });

    wait = sinon.stub({
      until: function() {}
    });

    matcher = sinon.stub();

    PropertyAssertion.__set__('chai', chai);
    PropertyAssertion.__set__('queue', queue);
    PropertyAssertion.__set__('wait', wait);
  });

  afterEach(function() {
    delete require.cache[require.resolve('../../lib/assertions/property-assertion')];
  });

  it('should assert a false result', function() {
    return assert(false, false, false);
  });

  it('should assert a true result', function() {
    return assert(true, false, false);
  });

  it('should assert a false result when negated', function() {
    return assert(false, true, false);
  });

  it('should assert a true result when negated', function() {
    return assert(true, true, false);
  });

  it('should assert a false result when waiting', function() {
    wait.until.returns(Q.resolve(false));

    return assert(false, false, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, false);
    });
  });

  it('should assert a true result when waiting', function() {
    wait.until.returns(Q.resolve(true));

    return assert(true, false, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, false);
    });
  });

  it('should assert a false result when negated and waiting', function() {
    wait.until.returns(Q.resolve(false));

    return assert(false, true, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, true);
    });
  });

  it('should assert a true result when negated and waiting', function() {
    wait.until.returns(Q.resolve(true));

    return assert(true, true, true).then(function() {
      expect(wait.until).to.have.been.calledWith(matcher, true);
    });
  });

  it('should not register a property more than once', function() {
    PropertyAssertion.register('test');
    PropertyAssertion.register('test');

    expect(chai.Assertion.addMethod).to.have.been.calledOnce;
  });

  it('should delegate the actual assertion when using the `delegate` flag', function() {
    utils.flag.withArgs(context, 'delegate').returns(true);

    PropertyAssertion.register('test');

    expect(queue.push).not.to.have.been.called;

    chai.Assertion.addMethod.returnValues[0](component);

    return assert(true, false, false);
  });

  function assert(result, negate, eventually) {
    component.has.withArgs('test', 'value').returns(matcher.returns(Q.resolve(result)));

    utils.flag.withArgs(context, 'negate').returns(negate);
    utils.flag.withArgs(context, 'eventually').returns(eventually);
    utils.flag.withArgs(context, 'object').returns(component);

    PropertyAssertion.register('test');

    expect(queue.push).to.have.been.called;

    return queue.push.firstCall.args[0]().then(function() {
      expect(context.assert).to.have.been.called;
      expect(context.assert.firstCall.args[0]).to.equal(result);
      expect(context.assert.firstCall.args[3]).to.equal(!negate);
    });
  }
});
