'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('find', function() {
  var find;
  var ComponentCollection;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    ComponentCollection = sinon.spy();

    mockery.registerMock('../component-collection', ComponentCollection);

    find = require('../../lib/utils/find');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should find components in the page', function() {
    var components = find('#test');

    expect(components).to.be.instanceOf(ComponentCollection);
    expect(ComponentCollection.firstCall.args[1]).to.have.property('parent', undefined);
    expect(ComponentCollection.firstCall.args[1]).to.have.property('selector', '#test');
  });

  it('should allow disabling the cache', function() {
    find('#test', false);

    expect(ComponentCollection.firstCall.args[1]).to.have.property('cache', false);
  });
});
