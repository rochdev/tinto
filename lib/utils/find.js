'use strict';

var Component = require('../component');
var ComponentCollection = require('../component-collection');
var Locator = require('./locator');

/**
 * @private
 * @param {string} selector
 * @returns {tinto.ComponentCollection}
 */
function find(selector) {
  return new ComponentCollection(Component, new Locator(null, selector));
}

module.exports = find;
