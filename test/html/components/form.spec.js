'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Form component', function() {
  var Form;
  var Button;
  var Component;
  var form;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    Component = sinon.spy();
    Component.prototype = sinon.stub({
      find: function() {},
      property: function() {}
    });

    Button = sinon.spy();

    mockery.registerMock('../../component', Component);
    mockery.registerMock('./button', Button);

    Form = require('../../../lib/html/components/form');

    form = new Form();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(form).to.be.instanceof(Component);
  });

  it('should submit', function() {
    var button = sinon.stub({click: function() {}});
    var component = sinon.stub({as: function() {}});

    component.as.withArgs(Button).returns(button);
    Component.prototype.find.withArgs('[type=submit]').returns(component);

    form.submit();

    expect(button.click).to.have.been.called;
  });
});
