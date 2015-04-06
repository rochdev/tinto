'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;
var value = require('../../../lib/html/properties/value');

describe('HTML: value property', function() {
  var context;

  beforeEach(function() {
    context = sinon.stub({attr: function() {}});
    context.attr.returns(Q.resolve('valid'));
  });

  it('should evaluate to true when it matches the value attribute', function() {
    return value.call(context, 'valid').then(function(result) {
      expect(result).to.be.true;
    });
  });

  it('should evaluate to false when it does not match the value attribute', function() {
    return value.call(context, 'invalid').then(function(result) {
      expect(result).to.be.false;
    });
  });
});
