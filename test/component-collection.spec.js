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
    mockery.registerMock('./component', Component);

    ComponentCollection = require('../lib/component-collection', {
      extend: extend,
      Component: Component
    });
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
      components = new ComponentCollection(promise);
    });

    it('should filter a component by index', function() {
      var component = components.at(0);

      expect(Component).to.have.been.called;
      expect(component).to.be.instanceof(Component);

      return Component.args[0][0].then(function(element) {
        expect(element).to.equal(1);
      });
    });

    it('should throw when a component retrieved by index does not exist', function() {
      components.at(2);

      return expect(Component.firstCall.args[0]).to.eventually.be.rejected;
    });

    it('should have a count', function() {
      return components.count().then(function(length) {
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
  });
});
