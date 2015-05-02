'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var rewire = require('rewire');
var expect = require('chai').use(sinonChai).expect;
var wait = rewire('../../lib/utils/wait');

describe('wait', function() {
  var runnable;

  beforeEach(function() {
    runnable = sinon.stub();
  });

  it('should eventually resolve true when the runnable returns true', function() {
    runnable.returns(Q.resolve({outcome: true}));

    return wait.until(runnable, false).then(function(result) {
      expect(result.outcome).to.be.true;
    });
  });

  it('should eventually resolve false when the runnable returns false', function() {
    runnable.returns(Q.resolve({outcome: false}));

    return wait.for(0).every(0).until(runnable, false).then(function(result) {
      expect(result.outcome).to.be.false;
    });
  });

  it('should retry until the runnable returns true', function() {
    runnable.onCall(0).returns(Q.resolve({outcome: false}));
    runnable.onCall(1).returns(Q.resolve({outcome: true}));

    return wait.for(5).every(0).until(runnable, false).then(function(result) {
      expect(result.outcome).to.be.true;
    });
  });
});
