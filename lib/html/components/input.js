'use strict';

var Component = require('../../component');
var inherits = require('../../utils/inherits');

/**
 * @memberOf tinto.html.components
 * @extends tinto.Component
 * @constructor
 * @inheritDoc
 * @property {tinto.Attribute} value
 */
function Input() {
  Component.apply(this, arguments);

  this.property('value');
}

inherits(Input, Component);

module.exports = Input;
