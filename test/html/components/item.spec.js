'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Item component', function() {
  var Item;
  var Component;
  var item;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    Component = sinon.spy();
    Component.prototype = sinon.stub({
      property: function() {}
    });

    mockery.registerMock('../../component', Component);

    Item = require('../../../lib/html/components/item');

    item = new Item();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(item).to.be.instanceof(Component);
  });

  it('should have property text', function() {
    expect(Component.prototype.property).to.have.been.calledWith('text');
  });
});
