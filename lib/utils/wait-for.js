'use strict';

var queue = require('../queue');

/**
 * @private
 * @param {Promise|function():Promise} it
 */
function waitFor(it) {
  if (it instanceof Function) {
    queue.push(it);
  } else {
    queue.push(function() {
      return it;
    });
  }
}

module.exports = waitFor;
