'use strict';

/**
 * @memberOf tinto.html.properties
 * @this tinto.Component
 * @returns {Promise}
 */
module.exports = function value() {
  return this.getAttribute('value');
};
