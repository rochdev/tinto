'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;

describe('waitFor', function() {
  var queue;
  var waitFor;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    queue = sinon.stub({push: function() {}});

    mockery.registerMock('../queue', queue);

    waitFor = require('../../lib/utils/wait-for');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should wait for a promise', function() {
    var it = Q.when();

    waitFor(it);

    var promise = queue.push.firstCall.args[0]();

    expect(promise).to.equal(it);
  });

  it('should wait for a function returning a promise', function() {
    var it = sinon.stub().returns(Q.when());

    waitFor(it);

    var wrapper = queue.push.firstCall.args[0];

    expect(wrapper).to.equal(it);
  });
});
