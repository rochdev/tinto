'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');
var mockery = require('mockery');
var expect = require('chai').use(sinonChai).use(chaiAsPromised).expect;

describe('pause', function() {
  var pause;
  var queue;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    sinon.spy(console, 'log');

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

  describe('when in TTY', function() {
    beforeEach(function() {
      process.stdin.isTTY = true;
      process.stdin.setRawMode = sinon.spy();
    });

    it('should pause until a key is pressed', function() {
      pause();

      var promise = queue.push.firstCall.args[0]();

      expect(promise).not.to.be.fulfilled;
      expect(process.stdin.setRawMode).to.have.been.calledWith(true);

      process.stdin.emit('data', ' ');

      expect(process.stdin.setRawMode).to.have.been.calledWith(false);
      expect(promise).to.be.fulfilled;
    });
  });

  describe('when not in TTY', function() {
    beforeEach(function() {
      process.stdin.isTTY = false;
    });

    it('should continue execution', function() {
      pause();

      var promise = queue.push.firstCall.args[0]();

      return expect(promise).to.be.fulfilled;
    });
  });
});
