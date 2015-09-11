'use strict';

/**
 * @memberOf tinto.html.states
 * @this tinto.Component
 * @returns {Promise}
 */
module.exports = function checked() {
  return this.execute(function() {
    return this.checked;
  });
};
