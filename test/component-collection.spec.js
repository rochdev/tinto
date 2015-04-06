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

  it('should delegate extend', function() {
    var protoProps = {};
    var staticProps = {};
    var test = ComponentCollection.extend(protoProps, staticProps);

    expect(extend).to.have.been.calledWith(protoProps, staticProps);
    expect(test).to.equal('test');
  });
});
