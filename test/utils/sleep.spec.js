'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).use(chaiAsPromised).expect;

describe('sleep', function() {
  var sleep;
  var queue;
  var timeout;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    queue = sinon.stub({
      push: function() {}
    });

    timeout = sinon.spy();

    mockery.registerMock('../queue', queue);
    mockery.registerMock('./timeout', timeout);

    sleep = require('../../lib/utils/sleep');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should add itself to the queue', function() {
    sleep();

    expect(queue.push).to.have.been.called;
  });

  it('should sleep for the specified duration', function() {
    sleep(100);

    var promise = queue.push.firstCall.args[0]();

    expect(timeout).to.have.been.called;
    expect(timeout.firstCall.args[1]).to.equal(100);

    timeout.firstCall.args[0]();

    return expect(promise).to.be.fulfilled;
  });
});
