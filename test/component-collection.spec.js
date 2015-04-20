'use strict';

var rewire = require('rewire');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;

describe('ComponentCollection', function() {
  var extend;
  var Component;
  var ComponentCollection;

  beforeEach(function() {
    extend = sinon.spy(function() {return 'test';});
    Component = require('../lib/component');
    ComponentCollection = rewire('../lib/component-collection');
    ComponentCollection.__set__('extend', extend);
  });

  afterEach(function() {
    delete require.cache[require.resolve('../lib/component')];
  });

  it('should filter a component by index', function() {
    var promise = Q.resolve(['test']);
    var components = new ComponentCollection(promise);
    var component = components.at(0);

    expect(component).to.be.instanceof(Component);

    // TODO: find a better way to mock dependencies to test this
    //return Component.args[0][0].then(function(element) {
    //  expect(element).to.equal('test');
    //});
  });

  // TODO: find a way to test this
  //it('should throw when a component retrieved by index does not exist', function() {
  //
  //});

  it('should have a count', function() {
    var promise = Q.resolve([1, 2, 3]);
    var components = new ComponentCollection(promise);

    return components.count().then(function(length) {
      expect(length).to.equal(3);
    });
  });

  it('should be iteratable', function() {
    var promise = Q.resolve([1, 2]);
    var components = new ComponentCollection(promise);
    var callback = sinon.spy();

    return components.each(callback).then(function() {
      // TODO: find a way to test component argument
      expect(callback).to.have.been.calledTwice;
      expect(callback.firstCall.args[0]).to.be.instanceof(Component);
      expect(callback.firstCall.args[1]).to.equal(0);
      expect(callback.secondCall.args[0]).to.be.instanceof(Component);
      expect(callback.secondCall.args[1]).to.equal(1);
    });
  });

  it('should delegate extend', function() {
    var protoProps = {};
    var staticProps = {};
    var test = ComponentCollection.extend(protoProps, staticProps);

    expect(extend).to.have.been.calledWith(protoProps, staticProps);
    expect(test).to.equal('test');
  });
});
