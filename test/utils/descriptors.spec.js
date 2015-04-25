'use strict';

var mockery = require('mockery');
var expect = require('chai').expect;

describe('descriptors', function() {
  var descriptors;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    descriptors = require('../../lib/utils/descriptors');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should return property descriptors', function() {
    var object = {
      foo: function() {},
      get bar() {
        return 'bar';
      }
    };

    var props = descriptors(object);

    expect(props.foo).to.be.defined;
    expect(props.foo.value).to.equal(object.foo);
    expect(props.bar).to.be.defined;
    expect(props.bar.get()).to.equal(object.bar);
  });

  it('should return inherited property descriptors', function() {
    var Parent = function() {};

    Parent.prototype.test = 'test';

    var object = new Parent();
    var props = descriptors(object);

    expect(props.test).to.be.defined;
    expect(props.test.value).to.equal(object.test);
  });
});
