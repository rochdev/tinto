'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;
var assertions = rewire('../lib/assertions');

// TODO: clean this up (or remove chai entirely?)

describe('Assertions', function() {
  var CountAssertion;
  var assert;
  var assertable;
  var chai;
  var utils;
  var context;
  var properties;
  var methods;
  var component;

  beforeEach(function() {
    CountAssertion = sinon.stub();

    assert = sinon.spy(function(name, callback) {
      return callback;
    });

    assertable = sinon.stub({
      equals: function() {},
      contains: function() {}
    });

    chai = {
      Assertion: {
        addMethod: sinon.spy(function(name, callback) {
          methods[name] = callback.bind(context);
        }),
        addProperty: sinon.spy(function(name, callback) {
          properties[name] = callback.bind(context);
        }),
        addChainableMethod: sinon.spy()
      }
    };

    utils = sinon.stub({
      flag: function() {}
    });

    component = sinon.stub({
      has: function() {},
      is: function() {}
    });

    Object.defineProperty(component, 'items', {
      get: function() {
        return {
          count: function() {
            return Q.resolve(2);
          }
        };
      }
    });

    context = sinon.stub({
      assert: function() {}
    });

    properties = {};
    methods = {};

    assertions.__set__('CountAssertion', CountAssertion);
    assertions.__set__('assert', assert);
  });

  it('should register default assertions', function() {
    assertions(chai, utils);

    expect(chai.Assertion.addProperty).to.have.been.calledWith('be');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('and');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('all');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('eventually');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('not');
    expect(chai.Assertion.addMethod).to.have.been.calledWith('equal');
  });

  it('should register equal assertion', function() {
    var equal = chai.Assertion.addMethod.withArgs('equal');
    var assertEqual = assert.withArgs('equal');

    assertions(chai, utils);

    equal.firstCall.args[1](assertable, 'value');

    expect(assertEqual.firstCall.args[2]).to.equal('equal #{exp} but was #{act}');
    expect(assertable.equals).to.have.been.calledWith('value');
  });

  it('should register contain assertion', function() {
    var contain = chai.Assertion.addChainableMethod.withArgs('contain');
    var assertContain = assert.withArgs('contain');

    assertions(chai, utils);

    contain.firstCall.args[1](assertable, 'value');

    expect(assertContain.firstCall.args[2]).to.equal('contain #{exp}');
    expect(assertable.contains).to.have.been.calledWith('value');
    expect(contain.firstCall.args[2].call(context)).to.equal(context);
  });

  it('should chain default assertions', function() {
    assertions(chai, utils);

    expect(properties.be()).to.equal(context);
    expect(properties.and()).to.equal(context);
    expect(properties.all()).to.equal(context);
    expect(properties.eventually()).to.equal(context);
    expect(properties.not()).to.equal(context);
  });

  it('should register have assertion', function() {
    var have = chai.Assertion.addChainableMethod.withArgs('have');
    var assertion = {};

    CountAssertion.returns(assertion);
    assertions(chai, utils);

    var assertCallback = have.firstCall.args[1];
    var chainCallback = have.firstCall.args[2];
    var countAssertion = assertCallback.call(context, 2);

    expect(CountAssertion).to.have.been.calledWith(context, 2);
    expect(countAssertion).to.equal(assertion);
    expect(chainCallback.call(context)).to.equal(context);
  });

  it('should flag all', function() {
    assertions(chai, utils);

    properties.all();

    expect(utils.flag).to.have.been.calledWith(context, 'all', true);
  });

  it('should flag eventually', function() {
    assertions(chai, utils);

    properties.eventually();

    expect(utils.flag).to.have.been.calledWith(context, 'eventually', true);
  });

  it('should flag not', function() {
    assertions(chai, utils);

    properties.not();

    expect(utils.flag).to.have.been.calledWith(context, 'negate', true);
  });
});
