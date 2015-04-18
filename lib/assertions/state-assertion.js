'use strict';

var chai = require('chai');
var util = require('util');
var queue = require('../queue');
var wait = require('../utils/wait');

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
    chai.use(function(chai, utils) {
      chai.Assertion.addProperty(name, function() {
        var self = this;
        var delegate = !!utils.flag(self, 'delegate');
        var negate = !!utils.flag(self, 'negate');

        if (delegate) {
          return test;
        } else {
          test(utils.flag(self, 'object'));
          return this;
        }

        function test(component) {
          queue.push(function() {
            if (utils.flag(self, 'eventually')) {
              return wait.until(component.is(name), negate).then(assert);
            } else {
              return component.is(name)().then(assert);
            }
          });
        }

        function assert(result) {
          self.assert(
            result,
            util.format('expected #{this} to eventually be %s', name),
            util.format('expected #{this} not to eventually be %s', name),
            !negate
          );
        }
      });
    });

    registered.push(name);
  }
};

module.exports = tinto.StateAssertion;
