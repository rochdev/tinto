'use strict';

var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Column component', function() {
  var Column;
  var Component;
  var column;

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

    column = new Column();
  });

  after(function() {
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(column).to.be.instanceof(Component);
  });

  it('should have property title', function() {
    return column.title.then(function(title) {
      expect(title).to.equal('text');
    });
  });
});
