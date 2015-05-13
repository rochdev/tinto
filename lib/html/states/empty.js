'use strict';

/**
 * @memberOf tinto.html.states
 * @this tinto.Component
 * @returns {Promise}
 */
module.exports = function empty() {
  return this.getAttribute('value').then(function(value) {
    return value.trim() === '';
  });
};
