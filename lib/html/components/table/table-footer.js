'use strict';

var inherits = require('../../../utils/inherits');
var Component = require('../../../component');
var Row = require('./row');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 * @property {tinto.ComponentCollection.<tinto.html.components.Row>} rows
 */
function TableFooter() {
  Component.apply(this, arguments);

  this.getter('rows', function() {
    return this.find('tr').asListOf(Row);
  });
}

inherits(TableFooter, Component);

module.exports = TableFooter;
