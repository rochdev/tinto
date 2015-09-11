'use strict';

var queue = require('../../queue');

/**
 * @private
 * @param {tinto.Component} component
 * @param {string} state
 * @returns {tinto.Component}
 */
function toggle(component, state) {
  queue.push(function() {
    return component.is(state)().then(function(assertion) {
      if (assertion.outcome === false) {
        return component.click();
      } else {
        throw new Error(component.toString() + ' is already ' + state + ' and cannot be ' + state);
      }
    });
  });

  return component;
}

module.exports = toggle;
