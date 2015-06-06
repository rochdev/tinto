'use strict';

var Component = require('../../component');
var text = require('../properties/text');
var inherits = require('../../utils/inherits');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 * @property {tinto.Attribute} value
 */
function Button() {
  Component.call(this, arguments);

  this.property('title', text);
}

inherits(Button, Component);

module.exports = Button;
