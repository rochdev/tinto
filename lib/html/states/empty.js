'use strict';

/**
 * @returns {Promise}
 */
module.exports = function isEmpty() {
  return this.getAttribute('value').then(function(value) {
    return value.trim() === '';
  });
};
