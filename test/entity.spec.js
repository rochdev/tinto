'use strict';

var mockery = require('mockery');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
//var Q = require('q');
var expect = require('chai').use(sinonChai).expect;

describe('Assertion', function() {
  var Entity;
  var Attribute;
  var AssertionResult;
  var PropertyAssertion;
  var StateAssertion;
  var descriptors;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
      warnOnReplace: false
    });
  });

  beforeEach(function() {
    PropertyAssertion = sinon.stub({
      register: function() {}
    });

    StateAssertion = sinon.stub({
      register: function() {}
    });

    descriptors = sinon.stub();

    mockery.registerMock('./assertions/property-assertion', PropertyAssertion);
    mockery.registerMock('./assertions/state-assertion', StateAssertion);
    mockery.registerMock('./utils/descriptors', descriptors);

    Attribute = require('../lib/attribute');
    AssertionResult = require('../lib/assertion-result');
    Entity = require('../lib/entity');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should register a getter', function() {
    var entity = new Entity();

    entity.getter('foo', function() {
      return 'bar';
    });

    expect(entity.foo).to.equal('bar');
  });

  it('should register getters from enumerable functions', function() {
    var entity = new Entity();
    var props = {
      get foo() {
        return 'foo';
      },
      bar: function() {
        return 'bar';
      },
      baz: 'baz'
    };

    Object.defineProperty(props, 'qux', {
      get: function() {
        return 'qux';
      },
      enumerable: false
    });

    descriptors.withArgs(props).returns({
      foo: Object.getOwnPropertyDescriptor(props, 'foo'),
      bar: Object.getOwnPropertyDescriptor(props, 'bar'),
      baz: Object.getOwnPropertyDescriptor(props, 'baz'),
      qux: Object.getOwnPropertyDescriptor(props, 'qux')
    });

    entity.getters(props);

    expect(entity.foo).to.equal('foo');
    expect(entity.bar).to.equal('bar');
    expect(entity.baz).to.be.undefined;
    expect(entity.qux).to.be.undefined;
  });

  it('should register a state', function() {
    var entity = new Entity();

    entity.state('foo', function() {});

    expect(StateAssertion.register).to.have.been.calledWith('foo');
  });

  it('should register a state with arguments', function() {
    var entity = new Entity();
    var matcher = sinon.spy();

    entity.state('foo', matcher, ['bar']);
    entity.is('foo')();

    expect(matcher).to.have.been.calledWith('bar');
  });

  it('should register states', function() {
    var entity = new Entity();

    entity.states('foo', {
      bar: function() {}
    });

    expect(StateAssertion.register).to.have.been.calledWith('foo');
    expect(StateAssertion.register).to.have.been.calledWith('bar');
  });

  it('should assert a state', function() {
    var entity = new Entity();

    entity.state('foo', function() {
      return true;
    });

    expect(entity.is('foo')()).to.eventually
      .be.instanceof(AssertionResult).and
      .have.property('value', true);
  });

  it('should throw an error when trying to assert a state that was not registered', function() {
    var entity = new Entity();

    expect(function() {
      entity.is('foo')();
    }).to.throw('Unsupported state "foo"');
  });

  it('should register a property', function() {
    var entity = new Entity();

    entity.property('foo', function() {});

    expect(PropertyAssertion.register).to.have.been.calledWith('foo');
  });

  it('should register a property with arguments', function() {
    var entity = new Entity();
    var matcher = sinon.spy();

    entity.property('foo', matcher, ['bar']);
    entity.has('foo')();

    expect(matcher).to.have.been.calledWith('bar');
  });

  it('should register properties', function() {
    var entity = new Entity();

    entity.properties('foo', {
      bar: function() {}
    });

    expect(PropertyAssertion.register).to.have.been.calledWith('foo');
    expect(PropertyAssertion.register).to.have.been.calledWith('bar');
  });

  it('should create an attribute for a registered property', function() {
    var entity = new Entity();

    entity.property('foo', function() {});

    expect(entity.foo).to.be.instanceof(Attribute);
  });

  it('should assert a property', function() {
    var entity = new Entity();

    entity.property('foo', function() {
      return 'value';
    });

    expect(entity.has('foo')()).to.eventually
      .be.instanceof(AssertionResult).and
      .have.property('value', 'value');
  });

  it('should throw an error when trying to assert a property that was not registered', function() {
    var entity = new Entity();

    expect(function() {
      entity.has('foo', 'bar')();
    }).to.throw('Unsupported property "foo"');
  });

  it('should assert a count', function() {
    var entity = new Entity();

    entity.getter('items', function() {
      var items = function() {};

      items.count = function() {
        return 1;
      };

      return items;
    });

    expect(entity.has(1, 'items')()).to.eventually
      .be.instanceof(AssertionResult).and
      .have.property('value', true);
  });

  it('should throw an error when trying to assert a count without a count member', function() {
    var entity = new Entity();

    entity.getter('items', function() {
      return function() {};
    });

    expect(function() {
      entity.has(1, 'items')();
    }).to.throw('Count assertions can only be applied to collections');
  });

  it('should throw an error when trying to assert a count without a count method', function() {
    var entity = new Entity();

    entity.getter('items', function() {
      var items = function() {};

      items.count = 1;

      return items;
    });

    expect(function() {
      entity.has(1, 'items')();
    }).to.throw('Count assertions can only be applied to collections');
  });
});
