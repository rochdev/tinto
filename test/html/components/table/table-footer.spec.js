'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: TableFooter component', function() {
  var TableFooter;
  var Row;
  var Component;
  var footer;

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
    Row = require('../../../../lib/html/components/table/row');
    TableFooter = require('../../../../lib/html/components/table/table-footer');

    footer = new TableFooter();
  });

  after(function() {
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(footer).to.be.instanceof(Component);
  });

  it('should have rows', function() {
    var collection = sinon.stub({asListOf: function() {}});

    collection.asListOf.withArgs(Row).returns('rows');
    Component.prototype.find.withArgs('tr').returns(collection);

    expect(footer.rows).to.equal('rows');
  });
});
