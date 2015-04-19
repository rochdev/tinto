'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;

describe('StateAssertion', function() {
  var StateAssertion;
  var assert;
  var chai;
  var component;

  beforeEach(function() {
    assert = sinon.stub();
    assert.withArgs('test').returns('assert');

    chai = {
      Assertion: {
        addProperty: sinon.spy()
      }
    };

    component = sinon.stub({
      is: function() {}
    });

    StateAssertion = rewire('../../lib/assertions/state-assertion');
    StateAssertion.__set__('assert', assert);
    StateAssertion.__set__('chai', chai);
  });

  afterEach(function() {
    delete require.cache[require.resolve('../../lib/assertions/state-assertion')];
  });

  it('should register a property', function() {
    StateAssertion.register('test');

    expect(chai.Assertion.addProperty).to.have.been.calledWith('test', 'assert');
    expect(assert.firstCall.args[2]).to.equal('be #{name}');

    assert.firstCall.args[1](component);

    expect(component.is).to.have.been.calledWith('test');
  });

  it('should not register a property more than once', function() {
    StateAssertion.register('test');
    StateAssertion.register('test');

    expect(chai.Assertion.addProperty).to.have.been.calledOnce;
  });
});
