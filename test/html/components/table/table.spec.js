'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Table component', function() {
  var Table;
  var Row;
  var Column;
  var Component;
  var table;

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
    Column = require('../../../../lib/html/components/table/column');
    Row = require('../../../../lib/html/components/table/row');
    Table = require('../../../../lib/html/components/table/table');

    table = new Table();
  });

  after(function() {
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(table).to.be.instanceof(Component);
  });

  it('should have property title', function() {
    var caption = sinon.stub({first: function() {}});

    Component.prototype.find.withArgs('caption').returns(caption);
    caption.first.returns(new Component());

    return table.title.then(function(title) {
      expect(title).to.equal('text');
    });
  });

  it('should have rows', function() {
    var collection = sinon.stub({asListOf: function() {}});

    collection.asListOf.withArgs(Row).returns('rows');
    Component.prototype.find.withArgs('tbody tr').returns(collection);

    expect(table).to.have.property('rows', 'rows');
  });

  it('should have columns', function() {
    var collection = sinon.stub({asListOf: function() {}});

    collection.asListOf.withArgs(Column).returns('columns');
    Component.prototype.find.withArgs('thead th').returns(collection);

    expect(table).to.have.property('columns', 'columns');
  });

  it('should have a footer', function() {
    var component = sinon.stub({as: function() {}});
    var collection = sinon.stub({first: function() {}});

    component.as.returns('footer');
    collection.first.returns(component);
    Component.prototype.find.withArgs('tfoot').returns(collection);

    expect(table).to.have.property('footer', 'footer');
  });
});
