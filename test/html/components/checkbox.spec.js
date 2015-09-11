'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Checbox component', function() {
  var Checkbox;
  var Component;
  var checkbox;
  var toggle;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    Component = sinon.spy();
    Component.prototype = sinon.stub({
      property: function() {},
      state: function() {}
    });

    toggle = sinon.spy();

    mockery.registerMock('../../component', Component);
    mockery.registerMock('../helpers/toggle', toggle);

    Checkbox = require('../../../lib/html/components/checkbox');

    checkbox = new Checkbox();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(checkbox).to.be.instanceof(Component);
  });

  it('should have property label', function() {
    expect(Component.prototype.property).to.have.been.calledWith('label');
  });

  it('should have state selected', function() {
    expect(Component.prototype.state).to.have.been.calledWith('checked');
  });

  it('should have state unselected', function() {
    expect(Component.prototype.state).to.have.been.calledWith('unchecked');
  });

  it('should be checkable', function() {
    checkbox.check();

    expect(toggle).to.have.been.calledWith(checkbox, 'checked');
  });

  it('should be uncheckable', function() {
    checkbox.uncheck();

    expect(toggle).to.have.been.calledWith(checkbox, 'unchecked');
  });
});
