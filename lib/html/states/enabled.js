'use strict';

/**
 * @memberOf tinto.html.states
 * @this tinto.Component
 * @returns {Promise}
 */
module.exports = function enabled() {
  return this.getAttribute('disabled').then(function(value) {
    return value === null;
  });
};
