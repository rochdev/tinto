'use strict';

var Component = require('../component');
var ComponentCollection = require('../component-collection');
var Locator = require('./locator');

/**
 * @private
 * @param {string} selector
 * @param {boolean} cache
 * @returns {tinto.ComponentCollection}
 */
function find(selector, cache) {
  return new ComponentCollection(Component, new Locator(selector, {cache: cache}));
}

module.exports = find;
