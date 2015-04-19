'use strict';

var chai = require('chai');
var assert = require('../utils/assert');

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
    chai.Assertion.addMethod(name, assert(name, function(component, value) {
      return component.has(name, value);
    }, 'have #{name} #{exp} but got #{act}'));

    registered.push(name);
  }
};

module.exports = tinto.PropertyAssertion;
