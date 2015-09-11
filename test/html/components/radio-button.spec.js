'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Radio button component', function() {
  var RadioButton;
  var Component;
  var radio;
  var checked;
  var unchecked;
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

    checked = require('../../../lib/html/states/checked');
    unchecked = require('../../../lib/html/states/unchecked');
    RadioButton = require('../../../lib/html/components/radio-button');

    radio = new RadioButton();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(radio).to.be.instanceof(Component);
  });

  it('should have property label', function() {
    expect(Component.prototype.property).to.have.been.calledWith('label');
  });

  it('should have state selected', function() {
    expect(Component.prototype.state).to.have.been.calledWith('selected', checked);
  });

  it('should have state unselected', function() {
    expect(Component.prototype.state).to.have.been.calledWith('unselected', unchecked);
  });

  it('should be selectable', function() {
    radio.choose();

    expect(toggle).to.have.been.calledWith(radio, 'selected');
  });
});
