'use strict';

var Component = require('../../component');
var inherits = require('../../utils/inherits');
var Button = require('./button');

/**
 * @memberOf tinto.html.components
 * @extends tinto.Component
 * @constructor
 * @inheritDoc
 */
function Form() {
  Component.apply(this, arguments);
}

inherits(Form, Component);

Form.prototype.submit = function() {
  this.find('[type=submit]').as(Button).click();
};

module.exports = Form;
