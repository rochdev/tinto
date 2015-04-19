'use strict';

var chai = require('chai');
var assert = require('../utils/assert');

/**
 * @name tinto.StateAssertion
 * @kind class
 */

/**
 * @name tinto.StateAssertion#enabled
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#disabled
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#visible
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#hidden
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#checked
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#unchecked
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#available
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#unavailable
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#empty
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#full
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#optional
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#required
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#selected
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#deselected
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.StateAssertion#missing
 * @type {tinto.ChainableAssertion}
 */

var registered = [];
var tinto = {};

tinto.StateAssertion = {};

/**
 * @param {string} name
 */
tinto.StateAssertion.register = function(name) {
  if (registered.indexOf(name) === -1) {
    chai.Assertion.addProperty(name, assert(name, function(component) {
      return component.is(name);
    }, 'be #{name}'));

    registered.push(name);
  }
};

module.exports = tinto.StateAssertion;
