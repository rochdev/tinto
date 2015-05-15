'use strict';

var Component = require('../../../component');
var inherits = require('../../../utils/inherits');
var Cell = require('./cell');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 * @property {tinto.ComponentCollection.<tinto.html.components.Cell>} cells
 */
function Row() {
  Component.apply(this, arguments);

  this.getter('cells', function() {
    return this.find('td,th').asListOf(Cell);
  });
}

inherits(Row, Component);

module.exports = Row;
