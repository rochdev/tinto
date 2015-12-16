'use strict';

var webdriver = require('selenium-webdriver');
var Q = require('q');
var config = require('./config');

/**
 * @constructor
 */
function Evaluator() {
  this._driver = null;
}

Evaluator.prototype.getDriver = function() {
  return this._driver;
};

Evaluator.prototype.open = function() {
  if (this._driver === null) {
    // TODO: make a configuration
    this._driver = new webdriver.Builder()
      .forBrowser(config.get('browser'))
      .build();
  }
};

Evaluator.prototype.close = function() {
  var callback = this._driver ? this._driver.close.bind(this._driver) : Q.resolve;

  this._driver = null;

  return callback();
};

/**
 * @param {Promise.<webdriver.WebElement>} context
 * @param {function()} callback
 * @param {...*} [args]
 * @returns {Promise.<*>}
 */
Evaluator.prototype.execute = function(context, callback, args) {
  args = Array.prototype.slice.call(arguments, 2);

  return Q.when(context).then(function(element) {
    return element.getDriver().executeScript(function(element, callback, args) {
      return eval('(' + callback + ')').apply(element, args);
    }, element, callback, args);
  });
};

/**
 * @param {string} selector
 * @returns {Promise.<Array.<webdriver.WebElement>>}
 */
Evaluator.prototype.find = function(selector) {
  return this.getDriver().findElements({css: selector});
};

module.exports = new Evaluator();
