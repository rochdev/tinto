'use strict';

var sinon = require('sinon');
var mockery = require('mockery');
var expect = require('chai').expect;

describe('load', function() {
  var load;
  var foo;
  var bar;
  var file;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    file = {
      walkSync: function(start, callback) {
        callback(start, [], [
          'foo.js',
          'bar.js'
        ]);
      }
    };

    foo = function foo() {};
    bar = function bar() {};

    mockery.registerMock('file', file);
    mockery.registerMock('hello/world/foo.js', foo);
    mockery.registerMock('hello/world/bar.js', bar);

    load = require('../../lib/utils/load');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should require all modules in subfolders', function() {
    var modules = load('hello', 'world');

    expect(modules).to.have.property('foo', foo);
    expect(modules).to.have.property('bar', bar);
  });

  it('should skip folders that cannot be found', function() {
    file.walkSync = sinon.stub().throws();

    expect(function() {
      load('hello', 'world');
    }).not.to.throw();
  });
});
