'use strict';

/**
 * @param {string} value
 * @returns {Promise}
 */
module.exports = function hasValue(value) {
  return this.attr('value').then(function(result) {
    return value === result;
  });
};
