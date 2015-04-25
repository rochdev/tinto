'use strict';

var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var Q = require('q');
var expect = require('chai').use(sinonChai).expect;
var mockery = require('mockery');

describe('Queue', function() {
  var queue;

  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    queue = require('../lib/queue');
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should add an item to the queue', function() {
    var item = function() {};

    queue.push(item);

    expect(queue.length).to.equal(1);
    expect(queue.pop()).to.equal(item);
  });

  it('should add items to the queue', function() {
    var firstItem = function() {};
    var secondItem = function() {};

    queue.push(firstItem);
    queue.push(secondItem);

    expect(queue.length).to.equal(2);
    expect(queue.pop()).to.equal(firstItem);
    expect(queue.pop()).to.equal(secondItem);
  });

  it('should add items to the queue at the same time', function() {
    var firstItem = function() {};
    var secondItem = function() {};

    queue.push(firstItem, secondItem);

    expect(queue.length).to.equal(2);
    expect(queue.pop()).to.equal(firstItem);
    expect(queue.pop()).to.equal(secondItem);
  });

  it('should remove items from the queue', function() {
    var item = function() {};

    queue.push(item);
    queue.pop();

    expect(queue.length).to.equal(0);
  });

  it('should clear all items', function() {
    var firstItem = function() {};
    var secondItem = function() {};

    queue.push(firstItem);
    queue.push(secondItem);
    queue.clear();

    expect(queue.length).to.equal(0);
  });

  it('should process items in the correct order', function(done) {
    var firstItem = sinon.spy(function() {
      return Q.resolve();
    });

    var secondItem = sinon.spy(function() {
      return Q.resolve();
    });

    var thirdItem = sinon.spy(function() {
      return Q.resolve();
    });

    queue.push(firstItem, secondItem, thirdItem);

    queue.process().then(function() {
      expect(firstItem).to.have.been.called;
      expect(secondItem).to.have.been.calledAfter(firstItem);
      expect(thirdItem).to.have.been.calledAfter(secondItem);
    }).then(done).done();
  });

  it('should wait for the promise to be resolved before going to the next item', function(done) {
    var firstSpy = sinon.spy();
    var secondSpy = sinon.spy();
    var thirdSpy = sinon.spy();

    var firstItem = function() {
      firstSpy();
      return Q.resolve();
    };

    var secondItem = function() {
      var deferred = Q.defer();

      setTimeout(function() {
        secondSpy();
        deferred.resolve();
      }, 0);

      return deferred.promise;
    };

    var thirdItem = function() {
      thirdSpy();
      return Q.resolve();
    };

    queue.push(firstItem, secondItem, thirdItem);
    queue.process().then(function() {
      expect(firstSpy).to.have.been.called;
      expect(secondSpy).to.have.been.calledAfter(firstSpy);
      expect(thirdSpy).to.have.been.calledAfter(secondSpy);
    }).then(done).done();
  });

  it('should wait for the previous call to process to finish before processing again', function(done) {
    var firstSpy = sinon.spy();
    var secondSpy = sinon.spy();

    var firstItem = function() {
      var deferred = Q.defer();

      setTimeout(function() {
        firstSpy();
        deferred.resolve();
      }, 0);

      return deferred.promise;
    };

    var secondItem = function() {
      secondSpy();
      return Q.resolve();
    };

    queue.push(firstItem);
    queue.process();
    queue.push(secondItem);

    queue.process().then(function() {
      expect(firstSpy).to.have.been.called;
      expect(secondSpy).to.have.been.calledAfter(firstSpy);
    }).then(done).done();
  });
});
