'use strict';

var Q = require('q');
var queue = [];

function Queue() {
  Object.defineProperty(this, 'length', {
    get: function() {
      return queue.length;
    }
  });
}

Queue.prototype.push = function() {
  return queue.push.apply(queue, arguments);
};

Queue.prototype.pop = function() {
  return queue.shift.apply(queue, arguments);
};

Queue.prototype.clear = function() {
  return queue.splice(0, queue.length);
};

Queue.prototype.process = function() {
  var promise = this.clear().reduce(Q.when, Q.resolve());

  queue.push(function() {
    return promise;
  });

  return promise;
};

module.exports = new Queue();
