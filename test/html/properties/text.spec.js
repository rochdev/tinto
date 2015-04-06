'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;
var text = require('../../../lib/html/properties/text');

describe('HTML: text property', function() {
  var context;

  beforeEach(function() {
    context = sinon.stub({text: function() {}});
    context.text.returns(Q.resolve('valid'));
  });

  it('should evaluate to true when it matches the inner text', function() {
    return text.call(context, 'valid').then(function(result) {
      expect(result).to.be.true;
    });
  });

  it('should evaluate to false when it does not match the inner text', function() {
    return text.call(context, 'invalid').then(function(result) {
      expect(result).to.be.false;
    });
  });
});
