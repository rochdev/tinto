'use strict';

var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('bundle', function() {
  var bundle;
  var tinto;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    tinto = {};

    mockery.registerMock('../tinto', tinto);

    bundle = require('../../lib/utils/bundle');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should register a bundle', function() {
    var root = {
      components: {
        Test: function() {}
      }
    };

    bundle('test', root);

    expect(root.components.Test).to.have.property('__bundle__', 'test');
    expect(tinto).to.have.property('test');
    expect(tinto.test).to.have.property('components');
    expect(tinto.test.components).to.have.property('Test');
    expect(tinto.test.components.Test).to.equal(root.components.Test);
  });
});
