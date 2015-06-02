'use strict';

var path = require('path');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('config', function() {
  var config;
  var fs;
  var bundle;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
      warnOnReplace: false
    });

    fs = {
      statSync: sinon.stub()
    };

    bundle = sinon.stub();

    mockery.registerMock('fs', fs);
    mockery.registerMock('./bundle', bundle);
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('given a config file', function() {
    beforeEach(function() {
      config = require('../../lib/utils/config');
    });

    it('should return the right config for the key', function() {
      mockery.registerMock(path.join(process.cwd(), 'tinto.conf.js'), {
        foo: 'bar'
      });

      var foo = config.get('foo');

      expect(foo).to.equal('bar');
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

    it('should load bundles by object', function() {
      var foo = {};

      mockery.registerMock(path.join(process.cwd(), 'tinto.conf.js'), {
        bundles: {
          foo: foo
        }
      });

      config.load();

      expect(bundle).to.have.been.calledWith('foo', foo);
    });

    it('should load bundles by string', function() {
      var foo = {};

      mockery.registerMock(path.join(process.cwd(), 'node_modules', 'foo'), foo);
      mockery.registerMock(path.join(process.cwd(), 'tinto.conf.js'), {
        bundles: {
          foo: 'foo'
        }
      });

      config.load();

      expect(bundle).to.have.been.calledWith('foo', foo);
    });
  });

  describe('given no config file in the current folder', function() {
    beforeEach(function() {
      fs.statSync.onCall(0).throws(new Error('test'));
      config = require('../../lib/utils/config');
    });

    it('should search up the directory tree', function() {
      mockery.registerMock(path.join(path.resolve(process.cwd(), '..'), 'tinto.conf.js'), {
        foo: 'baz'
      });

      var foo = config.get('foo');

      expect(foo).to.equal('baz');
    });
  });

  describe('given no config file exists', function() {
    beforeEach(function() {
      fs.statSync.throws(new Error('test'));
      config = require('../../lib/utils/config');
    });

    it('should return the defaults', function() {
      var bundles = config.get('bundles');

      expect(bundles).to.deep.equal({});
    });
  });
});
