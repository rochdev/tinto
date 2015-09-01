'use strict';

/**
 * @private
 * @param {function()} func
 * @param {number} [delay]
 * @returns {number}
 */
function timeout(func, delay) {
  return setTimeout(func, delay);
}

module.exports = timeout;
