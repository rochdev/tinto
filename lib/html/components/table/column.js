'use strict';

var Component = require('../../../component');
var text = require('../../properties/text');
var inherits = require('../../../utils/inherits');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 * @property {tinto.Attribute} title
 */
function Column() {
  Component.apply(this, arguments);

  this.property('title', text);
}

inherits(Column, Component);

module.exports = Column;
