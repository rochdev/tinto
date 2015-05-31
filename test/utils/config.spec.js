'use strict';

// TODO: support loading bundles by string

var path = require('path');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('config', function() {
  var config;
  var bundle;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    bundle = sinon.stub();

    mockery.registerMock('./bundle', bundle);

    config = require('../../lib/utils/config');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should return the right config for the key', function() {
    mockery.registerMock(path.join(process.cwd(), 'tinto.conf.js'), {
      foo: 'bar'
    });

    var foo = config.get('foo');

    expect(foo).to.equal('bar');
  });

  it('should search up the directory tree when config file cannot be found', function() {
    mockery.registerMock(path.join(path.resolve(process.cwd(), '..'), 'tinto.conf.js'), {
      foo: 'baz'
    });

    var foo = config.get('foo');

    expect(foo).to.equal('baz');
  });

  it('should return the defaults if the file cannot be found at all', function() {
    var bundles = config.get('bundles');

    expect(bundles).to.deep.equal({});
  });

  it('should use existing config if already set', function() {
    mockery.registerMock(path.join(process.cwd(), 'tinto.conf.js'), {
      foo: 'bar'
    });

    config.get('foo');

    mockery.registerMock(path.join(process.cwd(), 'tinto.conf.js'), {
      foo: 'baz'
    });

    var foo = config.get('foo');

    expect(foo).to.equal('bar');
  });

  it('should load bundles', function() {
    var foo = {};

    mockery.registerMock(path.join(process.cwd(), 'tinto.conf.js'), {
      bundles: {
        foo: foo
      }
    });

    config.load();

    expect(bundle).to.have.been.calledWith('foo', foo);
  });
});
