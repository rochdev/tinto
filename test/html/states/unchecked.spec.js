'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: unchecked state', function() {
  var unchecked;
  var context;
  var element;

  beforeEach(function() {
    context = sinon.stub({execute: function() {}});
    element = {};

    unchecked = require('../../../lib/html/states/unchecked');
  });

  it('should evaluate to false when the component is not unchecked', function() {
    unchecked.call(context);

    element.checked = true;

    var result = context.execute.firstCall.args[0].call(element);

    expect(result).to.be.false;
  });

  it('should evaluate to true when the component is unchecked', function() {
    unchecked.call(context);

    element.checked = false;

    var result = context.execute.firstCall.args[0].call(element);

    expect(result).to.be.true;
  });
});
