'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('CountAssertion', function() {
  var CountAssertion;
  var countAssertion;
  var component;
  var context;
  var assert;
  var assertFn;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    assertFn = sinon.stub();
    assertFn.returns('test');
    assert = sinon.stub();
    assert.returns(assertFn);

    component = sinon.stub({
      has: function() {}
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
    expect(countAssertion.test).to.equal('test');
    expect(assert).to.have.been.calledWith('test');
    expect(assertFn).to.have.been.calledWith(2);
    expect(assertFn.thisValues[0]).to.equal(context);
  });

  it('should delegate to the component', function() {
    component.has.returns('result');
    countAssertion.test;

    var result = assert.firstCall.args[1](component);

    expect(component.has).to.have.been.calledWith(2, 'test');
    expect(result).to.equal('result');
  });

  it('should not register a count assertion more than once', function() {
    assert.reset();
    CountAssertion.register('test');

    countAssertion = new CountAssertion(context, 2);
    countAssertion.test;

    expect(assert).to.have.been.calledOnce;
  });
});
