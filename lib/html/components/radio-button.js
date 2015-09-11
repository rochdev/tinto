'use strict';

var Component = require('../../component');
var inherits = require('../../utils/inherits');
var toggle = require('../helpers/toggle');
var checked = require('../states/checked');
var unchecked = require('../states/unchecked');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 */
function RadioButton(locator) {
  Component.call(this, locator);

  this.state('selected', checked);
  this.state('unselected', unchecked);

  this.property('label');
}

inherits(RadioButton, Component);

/**
 * @returns tinto.RadioButton
 */
RadioButton.prototype.choose = function() {
  return toggle(this, 'selected');
};

module.exports = RadioButton;
