'use strict';

var Component = require('../../component');
var inherits = require('../../utils/inherits');

/**
 * @extends tinto.Component
 * @constructor
 * @inheritDoc
 */
function Input() {
  Component.apply(this, arguments);
  this.property('value', function() {
    return this.getAttribute('value');
  });
}

inherits(Input, Component);

module.exports = Input;
