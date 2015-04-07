'use strict';

/**
 * @returns {Promise}
 */
module.exports = function isEmpty() {
  return this.attr('value').then(function(value) {
    return value.trim() === '';
  });
};
