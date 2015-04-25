'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('CountAssertion', function() {
  var CountAssertion;
  var countAssertion;
  var component;
  var test;
  var context;
  var assert;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    assert = sinon.spy(function(name, callback) {
      return callback;
    });

    test = sinon.stub({
      length: 2
    });

    component = sinon.stub({
      test: test
    });

    mockery.registerMock('../utils/assert', assert);

    CountAssertion = require('../../lib/assertions/count-assertion');
    CountAssertion.register('test');

    context = sinon.stub();
    countAssertion = new CountAssertion(context, 2);
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should register a count assertion', function() {
    expect(countAssertion).to.have.property('test');
    expect(assert).to.have.been.calledWith('test');
  });

  it('should delegate to assert', function() {
    countAssertion.test;

    expect(assert).to.have.been.called;
  });

  it('should not register a count assertion more than once', function() {
    assert.reset();
    CountAssertion.register('test');

    countAssertion = new CountAssertion(context, 2);
    countAssertion.test;

    expect(assert).to.have.been.calledOnce;
  });

  it('should have the right result', function() {
    countAssertion.test;

    var callback = assert.firstCall.args[1];

    return expect(callback(component)()).to.eventually.deep.equal({
      outcome: true,
      actual: 2
    });
  });

  it('should only allow asserting on collections', function() {
    countAssertion.test;

    var callback = assert.firstCall.args[1];

    test.length = 'string';

    expect(function() {
      callback(component)();
    }).to.throw();
  });
});
