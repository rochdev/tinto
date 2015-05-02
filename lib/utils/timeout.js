'use strict';

/**
 * @private
 * @param {function} func
 * @param {Number} [delay]
 * @returns {Number}
 */
function timeout(func, delay) {
  return setTimeout(func, delay);
}

module.exports = timeout;
