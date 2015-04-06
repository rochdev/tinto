'use strict';

var Q = require('q');

function Wait(total, every) {
  this._total = total;
  this._every = every;
}

Wait.prototype.for = function(time) {
  return new Wait(time, this._every);
};

Wait.prototype.every = function(time) {
  return new Wait(this._total, time);
};

Wait.prototype.until = function(runnable, negate) {
  var self = this;
  var deferred = Q.defer();
  var retryTimeout;
  var failTimeout;

  failTimeout = setTimeout(fail, self._total);
  runnable().then(test).catch(retry);

  function test(result) {
    if (result !== negate) {
      done();
    } else {
      retry();
    }
  }

  function retry() {
    retryTimeout = setTimeout(function() {
      runnable().then(test).catch(retry);
    }, self._every);
  }

  function done() {
    clear();
    deferred.resolve(true);
  }

  function fail() {
    clear();
    deferred.resolve(false);
  }

  function clear() {
    clearTimeout(retryTimeout);
    clearTimeout(failTimeout);
  }

  return deferred.promise;
};

// TODO: make those configurable
module.exports = new Wait(2000, 125);
