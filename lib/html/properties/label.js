'use strict';

/**
 * @memberOf tinto.html.properties
 * @this tinto.Component
 * @returns {Promise}
 */
module.exports = function label() {
  return this.execute(function() {
    var label = document.querySelector('label[for="' + this.getAttribute('id') + '"]');
  });
};
