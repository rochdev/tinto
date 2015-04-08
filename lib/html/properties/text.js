'use strict';

/**
 * @function
 * @param {string} value
 * @returns {Promise}
 */
module.exports = function hasText(value) {
  return this.text().then(function(result) {
    return value === result;
  });
};
