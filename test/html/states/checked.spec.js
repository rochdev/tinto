'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: checked state', function() {
  var checked;
  var context;
  var element;

  beforeEach(function() {
    context = sinon.stub({execute: function() {}});
    element = {};

    checked = require('../../../lib/html/states/checked');
  });

  it('should evaluate to false when the component is not checked', function() {
    checked.call(context);

    element.checked = false;

    var result = context.execute.firstCall.args[0].call(element);

    expect(result).to.be.false;
  });

  it('should evaluate to true when the component is checked', function() {
    checked.call(context);

    element.checked = true;

    var result = context.execute.firstCall.args[0].call(element);

    expect(result).to.be.true;
  });
});
