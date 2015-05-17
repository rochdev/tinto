'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('mixin', function() {
  var descriptors;
  var mixin;

  before(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    descriptors = sinon.stub();

    mockery.registerMock('./descriptors', descriptors);
  });

  beforeEach(function() {
    descriptors.reset();
    mixin = require('../../lib/utils/mixin');
  });

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should add properties from source to destination', function() {
    var destination = {};
    var source = {
      foo: 'bar',
      get baz() {
        return 'qux';
      }
    };

    descriptors.withArgs(source).returns({
      foo: {
        value: 'bar'
      },
      baz: {
        get: function() {
          return 'qux';
        }
      }
    });

    mixin(destination, source);

    expect(destination).to.have.property('foo', 'bar');
    expect(destination).to.have.property('baz', 'qux');
  });

  it('should overwrite existing configurable properties', function() {
    var destination = {
      foo: 'bar'
    };
    var source = {
      foo: 'baz'
    };

    descriptors.withArgs(destination).returns({
      foo: {
        value: 'bar',
        configurable: true
      }
    });

    descriptors.withArgs(source).returns({
      foo: {
        value: 'baz'
      }
    });

    mixin(destination, source);

    expect(destination).to.have.property('foo', 'baz');
  });

  it('should not overwrite existing non-configurable properties', function() {
    var destination = {};
    var source = {
      foo: 'baz'
    };

    Object.defineProperty(destination, 'foo', {
      value: 'bar'
    });

    descriptors.withArgs(destination).returns({
      foo: {
        value: 'bar',
        configurable: false
      }
    });

    descriptors.withArgs(source).returns({
      foo: {
        value: 'baz'
      }
    });

    mixin(destination, source);

    expect(destination).to.have.property('foo', 'bar');
  });
});
