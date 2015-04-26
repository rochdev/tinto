'use strict';

var Q = require('q');
var assert = require('../utils/assert');
var AssertionResult = require('../assertion-result');

/**
 * @name tinto.CountAssertion
 * @kind class
 */

/**
 * @name tinto.CountAssertion#items
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.CountAssertion#columns
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.CountAssertion#cells
 * @type {tinto.ChainableAssertion}
 */

/**
 * @name tinto.CountAssertion#rows
 * @type {tinto.ChainableAssertion}
 */

var registered = [];
var tinto = {};

/**
 *
 * @param {Assertion} self
 * @param {Number} count
 * @returns {tinto.ChainableAssertion}
 * @constructor
 */
tinto.CountAssertion = function CountAssertion(self, count) {
  var assertion = {};

  registered.forEach(function(prop) {
    Object.defineProperty(assertion, prop, {
      get: function() {
        return assert(prop, function(component) {
          return function() {
            var collection = component[prop];

            if (typeof collection !== 'object' || typeof collection.length !== 'number') {
              throw new Error('Count assertions can only be applied to collections');
            }

            return Q.resolve(collection.length).then(function(length) {
              return new AssertionResult(count === length, length);
            });
          };
        }, 'have #{exp} #{name} but got #{act}').call(self, count);
      }
    });
  });

  return assertion;
};

/**
 * @param {string} name
 */
tinto.CountAssertion.register = function(name) {
  if (registered.indexOf(name) === -1) {
    registered.push(name);
  }
};

module.exports = tinto.CountAssertion;
