'use strict';

/**
 * @memberOf tinto.html.states
 * @this tinto.Component
 * @returns {Promise}
 */
module.exports = function unchecked() {
  return this.execute(function() {
    return !this.checked;
  });
};
