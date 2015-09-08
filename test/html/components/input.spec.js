'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Input component', function() {
  var Input;
  var Component;
  var input;

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

    Input = require('../../../lib/html/components/input');

    input = new Input();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(input).to.be.instanceof(Component);
  });

  it('should have property value', function() {
    expect(Component.prototype.property).to.have.been.calledWith('value');
  });
});
