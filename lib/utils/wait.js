'use strict';

var Q = require('q');
var timeout = require('./timeout');

/**
 * @param {Number} total
 * @param {Number} every
 * @constructor
 */
function Wait(total, every) {
  this._total = total;
  this._every = every;
}

/**
 * @param {Number} time
 * @returns {Wait}
 */
Wait.prototype.for = function(time) {
  return new Wait(time, this._every);
};

/**
 * @param {Number} time
 * @returns {Wait}
 */
Wait.prototype.every = function(time) {
  return new Wait(this._total, time);
};

/**
 * @param {function()} runnable
 * @param {Boolean} negate
 * @returns {Promise.<AssertionResult>}
 */
Wait.prototype.until = function(runnable, negate) {
  var self = this;
  var deferred = Q.defer();
  var retryTimeout;
  var lastResults;
  var running = runnable().then(test);
  var failTimeout = timeout(finish, self._total);

  function test(results) {
    var callback = function(previousValue, currentValue) {
      return previousValue && currentValue.outcome !== negate;
    };

    lastResults = [].concat(results);

    if (lastResults.reduce(callback, true)) {
      finish();
    } else if (failTimeout) {
      retry();
    }
  }

  function retry() {
    retryTimeout = timeout(function() {
      running = runnable().then(test);
    }, self._every);
  }

  function finish() {
    clear();
    running.then(function() {
      deferred.resolve(lastResults);
    }).done();
  }

  function clear() {
    clearTimeout(retryTimeout);
    clearTimeout(failTimeout);

    retryTimeout = null;
    failTimeout = null;
  }

  return deferred.promise;
};

// TODO: make those configurable
module.exports = new Wait(300, 125);
