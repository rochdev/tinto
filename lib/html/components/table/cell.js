'use strict';

var Component = require('../../../component');
var text = require('../../properties/text');
var inherits = require('../../../utils/inherits');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 * @property {tinto.Attribute} value
 */
function Cell() {
  Component.apply(this, arguments);

  this.property('value', text);
}

inherits(Cell, Component);

module.exports = Cell;
