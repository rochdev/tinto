'use strict';

var Q = require('q');
var queue = [];

/**
 * @constructor
 */
function Queue() {
  Object.defineProperty(this, 'length', {
    get: getLength
  });
}

/**
 * @returns {number}
 */
Queue.prototype.push = function() {
  return queue.push.apply(queue, arguments);
};

/**
 * @returns {T}
 */
Queue.prototype.pop = function() {
  return queue.shift.apply(queue, arguments);
};

/**
 * @returns {Array.<T>}
 */
Queue.prototype.clear = function() {
  return queue.splice(0, queue.length);
};

/**
 * @returns {Promise}
 */
Queue.prototype.process = function() {
  var promise = this.clear().reduce(Q.when, Q.resolve());

  queue.push(function() {
    return promise.catch(function() {});
  });

  return promise;
};

/**
 * @private
 * @returns {number}
 */
function getLength() {
  return queue.length;
}

module.exports = new Queue();
