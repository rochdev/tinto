'use strict';

/**
 * @returns {Promise}
 */
module.exports = function getValue() {
  return this.getAttribute('value');
};
