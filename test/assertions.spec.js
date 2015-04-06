'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;
var assertions = rewire('../lib/assertions');

describe('Assertions', function() {
  var chai;
  var utils;
  var context;
  var properties;
  var methods;
  var component;

  beforeEach(function() {
    chai = {
      Assertion: {
        addMethod: sinon.spy(function(name, callback) {
          methods[name] = callback.bind(context);
        }),
        addProperty: sinon.spy(function(name, callback) {
          properties[name] = callback.bind(context);
        })
      }
    };

    utils = sinon.stub({
      flag: function() {}
    });

    component = sinon.stub({
      has: function() {},
      is: function() {}
    });

    context = sinon.stub({
      assert: function() {}
    });

    properties = {};
    methods = {};

    assertions(chai, utils);
  });

  it('should register default assertions', function() {
    expect(chai.Assertion.addProperty).to.have.been.calledWith('be');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('have');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('and');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('all');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('eventually');
    expect(chai.Assertion.addProperty).to.have.been.calledWith('not');
  });

  it('should chain default assertions', function() {
    expect(properties.be()).to.equal(context);
    expect(properties.have()).to.equal(context);
    expect(properties.and()).to.equal(context);
    expect(properties.all()).to.equal(context);
    expect(properties.eventually()).to.equal(context);
    expect(properties.not()).to.equal(context);
  });

  it('should flag all', function() {
    properties.all();

    expect(utils.flag).to.have.been.calledWith(context, 'all', true);
  });

  it('should flag eventually', function() {
    properties.eventually();

    expect(utils.flag).to.have.been.calledWith(context, 'eventually', true);
  });

  it('should flag not', function() {
    properties.not();

    expect(utils.flag).to.have.been.calledWith(context, 'negate', true);
  });
});
