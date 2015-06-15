'use strict';

var Q = require('q');
var queue = require('../queue');
var timeout = require('./timeout');

/**
 * @private
 * @param {Number} duration
 */
function sleep(duration) {
  queue.push(function() {
    var deferred = Q.defer();

    timeout(function() {
      deferred.resolve();
    }, duration);

    return deferred.promise;
  });
}

module.exports = sleep;
