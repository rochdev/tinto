'use strict';

var Component = require('../../component');
var inherits = require('../../utils/inherits');
var Item = require('./item');

/**
* @memberOf tinto.html.components
* @param {Promise} locator
* @extends tinto.Component
* @constructor
* @property {tinto.ComponentCollection.<tinto.html.components.Item>} items
*/
function List(locator) {
  Component.call(this, locator);

  this.property('items');
  this.getter('items', function() {
    return this.find('li').asListOf(Item);
  });
}

inherits(List, Component);

module.exports = List;
