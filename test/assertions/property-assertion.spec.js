'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;

describe('PropertyAssertion', function() {
  var PropertyAssertion;
  var assert;
  var chai;
  var component;

  beforeEach(function() {
    assert = sinon.stub();
    assert.withArgs('test').returns('assert');

    chai = {
      Assertion: {
        addMethod: sinon.spy()
      }
    };

    component = sinon.stub({
      has: function() {}
    });

    PropertyAssertion = rewire('../../lib/assertions/property-assertion');
    PropertyAssertion.__set__('assert', assert);
    PropertyAssertion.__set__('chai', chai);
  });

  afterEach(function() {
    delete require.cache[require.resolve('../../lib/assertions/property-assertion')];
  });

  it('should register a property', function() {
    PropertyAssertion.register('test');

    expect(chai.Assertion.addMethod).to.have.been.calledWith('test', 'assert');
    expect(assert.firstCall.args[2]).to.equal('have #{name} #{exp} but got #{act}');

    assert.firstCall.args[1](component, 'value');

    expect(component.has).to.have.been.calledWith('test', 'value');
  });

  it('should not register a property more than once', function() {
    PropertyAssertion.register('test');
    PropertyAssertion.register('test');

    expect(chai.Assertion.addMethod).to.have.been.calledOnce;
  });
});
