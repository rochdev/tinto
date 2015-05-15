'use strict';

var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Cell component', function() {
  var Cell;
  var Component;
  var cell;

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

    cell = new Cell();
  });

  after(function() {
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(cell).to.be.instanceof(Component);
  });

  it('should have property title', function() {
    return cell.value.then(function(value) {
      expect(value).to.equal('text');
    });
  });
});
