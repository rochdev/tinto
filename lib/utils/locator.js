'use strict';

var Q = require('q');
var uuid = require('uuid');
var evaluator = require('./evaluator');
var tinto = {};

/**
 * @param {string} selector
 * @param {{parent: tinto.Component, index: number, cache: boolean}} [options]
 * @property {string} id
 * @property {string} selector
 * @property {number} index
 * @property {boolean} cache
 * @constructor
 */
tinto.Locator = function Locator(selector, options) {
  this.id = null;
  this.selector = selector;
  this.parent = options && options.parent;
  this.index = options && options.index;

  if (options) {
    this.cache = options.cache !== undefined ? options.cache : true;
  }
};

/**
 * @returns {Promise.<webdriver.WebElement|Array.<webdriver.WebElement>>}
 */
tinto.Locator.prototype.locate = function() {
  var self = this;
  var parent = this.parent && this.parent.getElement() || Q.when(evaluator.getDriver());

  if (this.cache && this.id) {
    return Q.when(evaluator.find('[data-tinto-id="' + this.id + '"]'))
      .then(function(elements) {
        return elements[0];
      });
  } else {
    return Q.when(parent.then(function(parent) {
      var children = parent.findElements({css: self.parent ? ':scope ' + self.selector : self.selector});

      if (self.index !== undefined) {
        return children.then(function(elements) {
          var element = elements[self.index >= 0 ? self.index : elements.length + self.index];

          return element && evaluator.execute(element, function(id) {
            id = this.getAttribute('data-tinto-id') || id;

            this.setAttribute('data-tinto-id', id);

            return id;
          }, uuid.v4()).then(function(id) {
            self.id = id;

            return element;
          }).catch(function() {});
        });
      } else {
        return children;
      }
    }));
  }
};

/**
 * @returns {string}
 */
tinto.Locator.prototype.getMessage = function() {
  var parts = ['an element matching selector "' + this.selector + '"'];

  if (this.parent) {
    parts.push('under ' + this.parent);
  }

  if (this.index) {
    parts.push('at index ' + this.index);
  }

  return parts.join(' ');
};

module.exports = tinto.Locator;
