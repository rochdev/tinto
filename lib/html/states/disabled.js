'use strict';

/**
 * @memberOf tinto.html.states
 * @this tinto.Component
 * @returns {Promise}
 */
module.exports = function disabled() {
  return this.getAttribute('disabled').then(function(value) {
    return value !== null;
  });
};
