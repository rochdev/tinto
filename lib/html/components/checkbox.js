'use strict';

var Component = require('../../component');
var inherits = require('../../utils/inherits');
var toggle = require('../helpers/toggle');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 */
function Checkbox(locator) {
  Component.call(this, locator);

  this.state('checked');
  this.state('unchecked');

  this.property('label');
}

inherits(Checkbox, Component);

/**
 * @returns tinto.Checkbox
 */
Checkbox.prototype.check = function() {
  return toggle(this, 'checked');
};

/**
 * @returns tinto.Checkbox
 */
Checkbox.prototype.uncheck = function() {
  return toggle(this, 'unchecked');
};

module.exports = Checkbox;
