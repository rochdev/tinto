'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Button component', function() {
  var Button;
  var Component;
  var button;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    Component = sinon.spy();
    Component.prototype = sinon.stub({
      property: function() {},
      states: function() {}
    });

    mockery.registerMock('../../component', Component);

    Button = require('../../../lib/html/components/button');

    button = new Button();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(button).to.be.instanceof(Component);
  });

  it('should have property text', function() {
    expect(Component.prototype.property).to.have.been.calledWith('label');
  });

  it('should have states enabled and disabled', function() {
    expect(Component.prototype.states).to.have.been.calledWith('enabled', 'disabled');
  });
});
