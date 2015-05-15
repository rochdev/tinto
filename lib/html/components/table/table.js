'use strict';

var Component = require('../../../component');
var inherits = require('../../../utils/inherits');
var Column = require('./column');
var Row = require('./row');
var Footer = require('./table-footer');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 * @property {tinto.Attribute} title
 * @property {tinto.ComponentCollection.<tinto.html.components.Column>} columns
 * @property {tinto.ComponentCollection.<tinto.html.components.Row>} rows
 * @property {tinto.html.components.TableFooter} footer
 */
function Table(locator) {
  Component.call(this, locator);

  this.property('title', function() {
    return this.find('caption').first().getText();
  });

  this.getters({
    get columns() {return this.find('thead th').asListOf(Column);},
    get rows() {return this.find('tbody tr').asListOf(Row);},
    get footer() {return this.find('tfoot').first().as(Footer);}
  });
}

inherits(Table, Component);

module.exports = Table;
