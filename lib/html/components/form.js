'use strict';

var Component = require('../../component');
var inherits = require('../../utils/inherits');
var Button = require('./button');

/**
 * @memberOf tinto.html.components
 * @param {Promise} locator
 * @extends tinto.Component
 * @constructor
 */
function Form() {
  Component.call(this, arguments);

  var self = this;
  this.submit = function() {
    self.find('[type=submit]').as(Button).click();
  };
}

inherits(Form, Component);

module.exports = Form;
