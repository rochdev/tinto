'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;
var empty = require('../../../lib/html/states/empty');

describe('HTML: empty state', function() {
  var context;

  beforeEach(function() {
    context = sinon.stub({getAttribute: function() {}});
  });

  it('should evaluate to false when the value is not empty', function() {
    context.getAttribute.returns(Q.resolve('valid'));

    return empty.call(context).then(function(result) {
      expect(result).to.be.false;
    });
  });

  it('should evaluate to true when the value is empty', function() {
    context.getAttribute.returns(Q.resolve(''));

    return empty.call(context).then(function(result) {
      expect(result).to.be.true;
    });
  });
});
