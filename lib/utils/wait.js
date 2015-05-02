'use strict';

var Q = require('q');

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
 * @returns {Promise}
 */
Wait.prototype.until = function(runnable, negate) {
  var self = this;
  var deferred = Q.defer();
  var retryTimeout;
  var failTimeout;
  var lastResult;

  failTimeout = setTimeout(finish, self._total);
  runnable().then(test).catch(retry);

  function test(result) {
    lastResult = result;

    if (result.outcome !== negate) {
      finish();
    } else {
      retry();
    }
  }

  function retry() {
    retryTimeout = setTimeout(function() {
      runnable().then(test).catch(retry);
    }, self._every);
  }

  function finish() {
    clear();
    deferred.resolve(lastResult);
  }

  function clear() {
    clearTimeout(retryTimeout);
    clearTimeout(failTimeout);
  }

  return deferred.promise;
};

// TODO: make those configurable
module.exports = new Wait(2000, 125);
