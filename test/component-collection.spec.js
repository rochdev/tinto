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
    var locator;
    var promise;
    var components;

    beforeEach(function() {
      promise = Q.resolve([1, 2]);
      locator = {
        parent: 'parent',
        selector: 'selector',
        locate: sinon.stub().returns(promise)
      };
      components = new ComponentCollection(Component, locator);
    });

    it('should filter a component by index', function() {
      var component = components.at(0);

      expect(Component).to.have.been.called;
      expect(component).to.be.instanceof(Component);

      assertLocator(Component, 0);
    });

    it('should proxy index filtering', function() {
      var component = components(0);

      expect(Component).to.have.been.called;
      expect(component).to.be.instanceof(Component);

      assertLocator(Component, 0);
    });

    it('should filter the first element', function() {
      components.first();

      assertLocator(Component, 0);
    });

    it('should filter the last element', function() {
      components.last();

      assertLocator(Component, -1);
    });

    it('should have a count', function() {
      return components.count().then(function(count) {
        expect(count).to.equal(2);
      });
    });

    it('should be iteratable', function() {
      var callback = sinon.spy();

      return components.each(callback).then(function() {
        expect(callback).to.have.been.calledTwice;
        expect(callback.thisValues[0]).to.equal(1);
        expect(callback.thisValues[1]).to.equal(2);

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
        expect(callback).to.have.been.calledTwice;
        expect(callback.thisValues[0]).to.equal(1);
        expect(callback.thisValues[1]).to.equal(2);

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

      assertLocator(Test, 0);
    });

    it('should be able to cast itself to a collection of another component type', function() {
      var Test = sinon.spy();
      var tests = components.asListOf(Test);
      var test = tests.at(0);

      expect(Test).to.have.been.called;
      expect(test).to.be.instanceof(Test);

      assertLocator(Test, 0);
    });

    it('should be able to cast its first element', function() {
      var Test = sinon.spy();

      Component.prototype.as = sinon.stub().withArgs(Test).returns('test');

      var test = components.as(Test);

      expect(test).to.equal('test');
    });

    it('should get its elements', function() {
      var elements = components.getElements();

      return Q.all([promise, elements]).then(function(results) {
        expect(results[0][0]).to.equal(results[1][0]);
        expect(results[0][1]).to.equal(results[1][1]);
      });
    });

    function assertLocator(spy, index) {
      expect(spy.args[0][0]).to.have.property('parent', locator.parent);
      expect(spy.args[0][0]).to.have.property('selector', locator.selector);
      expect(spy.args[0][0]).to.have.property('index', index);
    }
  });
});
