'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Row component', function() {
  var Row;
  var Cell;
  var Component;
  var row;

  before(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
      warnOnReplace: false
    });
  });

  beforeEach(function() {
    Component = require('../../../mocks/component');
    mockery.registerMock('../../../component', Component);
    Cell = require('../../../../lib/html/components/table/cell');
    Row = require('../../../../lib/html/components/table/row');

    row = new Row();
  });

  after(function() {
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(row).to.be.instanceof(Component);
  });

  it('should have rows', function() {
    var collection = sinon.stub({asListOf: function() {}});

    collection.asListOf.withArgs(Cell).returns('cells');
    Component.prototype.find.withArgs('td,th').returns(collection);

    expect(row.cells).to.equal('cells');
  });
});
