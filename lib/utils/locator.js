'use strict';

var Q = require('q');
var uuid = require('node-uuid');
var evaluator = require('./evaluator');
var tinto = {};

/**
 * @param {tinto.Component} parent
 * @param {string} selector
 * @param {Number} [index]
 * @property {string} id
 * @property {tinto.Component} parent
 * @property {string} selector
 * @property {Number} index
 * @constructor
 */
tinto.Locator = function Locator(parent, selector, index) {
  this.id = null;
  this.parent = parent;
  this.selector = selector;
  this.index = index;
};

/**
 * @returns {Promise.<webdriver.WebElement|Array.<webdriver.WebElement>>}
 */
tinto.Locator.prototype.locate = function() {
  var self = this;
  var parent = self.parent && self.parent.getElement() || Q.when(evaluator.getDriver());

  if (this.id) {
    return Q.when(evaluator.find('[data-tinto-id="' + this.id + '"]'))
      .then(function(elements) {
        return elements[0];
      });
  } else {
    return Q.when(parent.then(function(parent) {
      if (self.index !== undefined) {
        return parent.findElements({css: self.selector}).then(function(elements) {
          var element = elements[self.index >= 0 ? self.index : elements.length + self.index];

          return element && evaluator.execute(element, function(id) {
            id = this.getAttribute('data-tinto-id') || id;

            this.setAttribute('data-tinto-id', id);

            return id;
          }, uuid.v4()).then(function(id) {
            self.id = id;

            return element;
          });
        });
      } else {
        return parent.findElements({css: self.selector});
      }
    }));
  }
};

module.exports = tinto.Locator;
