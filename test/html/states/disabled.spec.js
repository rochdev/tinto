'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: disabled state', function() {
  var disabled;
  var context;

  beforeEach(function() {
    context = {getAttribute: sinon.stub().withArgs('disabled')};
    disabled = require('../../../lib/html/states/disabled');
  });

  it('should evaluate to false when the component is not disabled', function() {
    context.getAttribute.returns(Q.when(null));

    return disabled.call(context).then(function(outcome) {
      expect(outcome).to.be.false;
    });
  });

  it('should evaluate to true when the component is disabled', function() {
    context.getAttribute.returns(Q.when(''));

    return disabled.call(context).then(function(outcome) {
      expect(outcome).to.be.true;
    });
  });
});
