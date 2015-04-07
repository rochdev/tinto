'use strict';

var chai = require('chai');
var util = require('util');
var queue = require('../queue');
var wait = require('../utils/wait');

/**
 * @name tinto.PropertyAssertion
 * @kind class
 */

/**
 * @name tinto.PropertyAssertion#been
 * @type {tinto.StateAssertion}
 */

/**
 * @name tinto.PropertyAssertion#label
 * @kind function
 * @param {string} value
 * @returns {tinto.ChainableAssertion}
 */

/**
 * @name tinto.PropertyAssertion#text
 * @kind function
 * @param {string} value
 * @returns {tinto.ChainableAssertion}
 */

/**
 * @name tinto.PropertyAssertion#title
 * @kind function
 * @param {string} value
 * @returns {tinto.ChainableAssertion}
 */

/**
 * @name tinto.PropertyAssertion#value
 * @kind function
 * @param {string} value
 * @returns {tinto.ChainableAssertion}
 */

var registered = [];
var tinto = {};

tinto.PropertyAssertion = {};

/**
 * @param {string} name
 */
tinto.PropertyAssertion.register = function(name) {
  if (registered.indexOf(name) === -1) {
    chai.use(function(chai, utils) {
      chai.Assertion.addMethod(name, function(value) {
        var self = this;
        var negate = !!utils.flag(self, 'negate');
        var component = utils.flag(self, 'object');

        queue.push(function() {
          if (utils.flag(self, 'eventually')) {
            return wait.until(component.has(name, value), negate).then(assert);
          } else {
            return component.has(name, value)().then(assert);
          }
        });

        function assert(result) {
          self.assert(
            result,
            util.format('expected #{this} to eventually have %s "%s"', name, value),
            util.format('expected #{this} not to eventually have %s "%s"', name, value),
            !negate
          );
        }

        return this;
      });
    });

    registered.push(name);
  }
};

module.exports = tinto.PropertyAssertion;
