'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: Form component', function() {
  var Form;
  var Component;
  var form;

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

    Form = require('../../../lib/html/components/button');

    form = new Form();
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should extend Component', function() {
    expect(form).to.be.instanceof(Component);
  });

});
