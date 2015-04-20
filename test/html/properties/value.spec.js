'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;
var value = require('../../../lib/html/properties/value');

describe('HTML: value property', function() {
  var context;

  beforeEach(function() {
    context = sinon.stub({getAttribute: function() {}});
    context.getAttribute.returns(Q.resolve('test'));
  });

  it('should return the value attribute', function() {
    return value.call(context).then(function(result) {
      expect(result).to.equal('test');
    });
  });
});
