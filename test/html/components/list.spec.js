'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: List component', function() {
  var List;
  var Component;
  var Item;
  var list;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    Component = sinon.spy();
    Component.prototype = sinon.stub({
      property: function() {},
      getter: function() {}
    });

    Item = sinon.spy();

    mockery.registerMock('./item', Item);
    mockery.registerMock('../../component', Component);

    List = require('../../../lib/html/components/list');

    list = new List();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(list).to.be.instanceof(Component);
  });

  it('should have property items', function() {
    expect(Component.prototype.property).to.have.been.calledWith('items');
  });

  it('should have a collection of items', function() {
    var collection = {
      asListOf: sinon.spy(function() {return Q.resolve([1, 2]);})
    };

    var context = {
      find: sinon.spy(function() {return collection;})
    };

    expect(Component.prototype.getter).to.have.been.calledWith('items');

    var itemsPromise = Component.prototype.getter.firstCall.args[1].call(context);

    return itemsPromise.then(function(items) {
      expect(context.find).to.have.been.calledWith('li');
      expect(collection.asListOf).to.have.been.calledWith(Item);
      expect(items).to.deep.equal([1, 2]);
    });
  });
});
