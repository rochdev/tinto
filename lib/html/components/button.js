'use strict';

var Component = require('../../component');
var text = require('../properties/text');
var inherits = require('../../utils/inherits');

/**
 * @memberOf tinto.html.components
 * @extends tinto.Component
 * @constructor
 * @inheritDoc
 * @property {tinto.Attribute} label
 */
function Button() {
  Component.apply(this, arguments);

  this.property('label', text);
}

inherits(Button, Component);

module.exports = Button;
