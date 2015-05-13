'use strict';

var Component = require('../../component');
var inherits = require('../../utils/inherits');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 */
function Item() {
  Component.apply(this, arguments);

  this.property('text');
}

inherits(Item, Component);

module.exports = Item;
