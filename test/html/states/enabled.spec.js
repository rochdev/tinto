'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;

describe('HTML: enabled state', function() {
  var enabled;
  var context;

  beforeEach(function() {
    context = {getAttribute: sinon.stub().withArgs('enabled')};
    enabled = require('../../../lib/html/states/enabled');
  });

  it('should evaluate to false when the component is not enabled', function() {
    context.getAttribute.returns(Q.when(''));

    return enabled.call(context).then(function(outcome) {
      expect(outcome).to.be.false;
    });
  });

  it('should evaluate to true when the component is enabled', function() {
    context.getAttribute.returns(Q.when(null));

    return enabled.call(context).then(function(outcome) {
      expect(outcome).to.be.true;
    });
  });
});
