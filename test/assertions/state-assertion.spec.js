'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;

describe('StateAssertion', function() {
  var chai;
  var utils;
  var context;
  var queue;
  var component;
  var matcher;
  var wait;
  var StateAssertion;

  beforeEach(function() {
    StateAssertion = rewire('../../lib/assertions/state-assertion');

    chai = {
      Assertion: {
        addProperty: sinon.spy(function(name, callback) {
          callback.call(context);
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
      is: function() {}
    });

    context = sinon.stub({
      assert: function() {}
    });

    wait = sinon.stub({
      until: function() {}
    });

    matcher = sinon.stub();

    StateAssertion.__set__('chai', chai);
    StateAssertion.__set__('queue', queue);
    StateAssertion.__set__('wait', wait);
  });

  afterEach(function() {
    delete require.cache[require.resolve('../../lib/assertions/state-assertion')];
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

  it('should not register a state more than once', function() {
    StateAssertion.register('test');
    StateAssertion.register('test');

    expect(chai.Assertion.addProperty).to.have.been.calledOnce;
  });

  function assert(result, negate, eventually) {
    component.is.withArgs('test').returns(matcher.returns(Q.resolve(result)));

    utils.flag.withArgs(context, 'negate').returns(negate);
    utils.flag.withArgs(context, 'eventually').returns(eventually);
    utils.flag.withArgs(context, 'object').returns(component);

    StateAssertion.register('test');

    expect(queue.push).to.have.been.called;

    return queue.push.firstCall.args[0]().then(function() {
      expect(context.assert).to.have.been.called;
      expect(context.assert.firstCall.args[0]).to.equal(result);
      expect(context.assert.firstCall.args[3]).to.equal(!negate);
    });
  }
});
