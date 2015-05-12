'use strict';

var mockery = require('mockery');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var Q = require('q');
var expect = require('chai').use(sinonChai).use(chaiAsPromised).expect;

describe('ComponentCollection', function() {
  var extend;
  var Component;
  var ComponentCollection;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    extend = sinon.spy(function() {return 'test';});
    Component = sinon.spy();

    mockery.registerMock('./utils/extend', extend);

    ComponentCollection = require('../lib/component-collection');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should delegate extend', function() {
    var protoProps = {};
    var staticProps = {};
    var test = ComponentCollection.extend(protoProps, staticProps);

    expect(extend).to.have.been.calledWith(protoProps, staticProps);
    expect(test).to.equal('test');
  });

  describe('given the elements [1, 2]', function() {
    var promise;
    var components;

    beforeEach(function() {
      promise = Q.resolve([1, 2]);
      components = new ComponentCollection(Component, promise);
    });

    it('should filter a component by index', function() {
      var component = components.at(0);

      expect(Component).to.have.been.called;
      expect(component).to.be.instanceof(Component);

      return Component.args[0][0].then(function(element) {
        expect(element).to.equal(1);
      });
    });

    it('should filter the first element', function() {
      components.first();

      return Q.all(Component.args[0][0]).then(function(value) {
        expect(value).to.equal(1);
      });
    });

    it('should filter the last element', function() {
      components.last();

      return Q.all(Component.args[0][0]).then(function(value) {
        expect(value).to.equal(2);
      });
    });

    it('should have a length', function() {
      return components.length.then(function(length) {
        expect(length).to.equal(2);
      });
    });

    it('should be iteratable', function() {
      var callback = sinon.spy();

      return components.each(callback).then(function() {
        expect(callback).to.have.been.calledTwice;

        expect(callback.firstCall.args[0]).to.be.instanceof(Component);
        expect(callback.firstCall.args[1]).to.equal(0);

        expect(callback.secondCall.args[0]).to.be.instanceof(Component);
        expect(callback.secondCall.args[1]).to.equal(1);

        return Q.all([
          expect(Component.firstCall.args[0]).to.eventually.equal(1),
          expect(Component.secondCall.args[0]).to.eventually.equal(2)
        ]);
      });
    });

    it('should be mappable', function() {
      var callback = sinon.stub();

      callback.onFirstCall().returns(1);
      callback.onSecondCall().returns(2);

      return components.map(callback).then(function(values) {
        expect(values[0]).to.equal(1);
        expect(values[1]).to.equal(2);
      });
    });

    it('should build a new collection of a different type', function() {
      var Test = sinon.spy();
      var tests = ComponentCollection.of(Test).from(components);
      var test = tests.at(0);

      expect(Test).to.have.been.called;
      expect(test).to.be.instanceof(Test);

      return Test.args[0][0].then(function(element) {
        expect(element).to.equal(1);
      });
    });

    it('should be able to cast itself to a collection of another component type', function() {
      var Test = sinon.spy();
      var tests = components.asListOf(Test);
      var test = tests.at(0);

      expect(Test).to.have.been.called;
      expect(test).to.be.instanceof(Test);

      return Test.args[0][0].then(function(element) {
        expect(element).to.equal(1);
      });
    });

    it('should get its elements', function() {
      var elements = components.getElements();

      return Q.all([promise, elements]).then(function(results) {
        expect(results[0][0]).to.equal(results[1][0]);
        expect(results[0][1]).to.equal(results[1][1]);
      });
    });
  });
});
