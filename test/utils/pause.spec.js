'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).expect;

describe('pause', function() {
  var pause;
  var queue;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    sinon.stub(console, 'log');

    queue = sinon.stub({
      push: function() {}
    });

    mockery.registerMock('../queue', queue);

    pause = require('../../lib/utils/pause');
  });

  afterEach(function() {
    console.log.restore();

    mockery.deregisterAll();
    mockery.disable();
  });

  it('should add itself to the queue', function() {
    pause();

    expect(queue.push).to.have.been.called;
  });

  it('should pause until a key is pressed when in TTY', function() {
    pause();

    var promise = queue.push.firstCall.args[0]();

    expect(promise).not.to.be.fulfilled;

    process.stdin.emit('data', ' ');

    expect(promise).to.be.fulfilled;
  });

  it('should pause until a key is pressed when not in TTY', function() {
    process.stdin.isTTY = false;

    pause();

    var promise = queue.push.firstCall.args[0]();

    expect(promise).not.to.be.fulfilled;

    process.stdin.emit('data', ' ');

    expect(promise).to.be.fulfilled;
  });
});
