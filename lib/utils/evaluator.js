'use strict';

var Q = require('q');
var ElementNotFoundError = require('../errors/element-not-found-error');

/**
 * @constructor
 */
function Evaluator() {}

/**
 * @param {Promise.<webdriver.WebElement>} context
 * @param {function} callback
 * @param {...*} [args]
 * @returns {Promise.<*>}
 */
Evaluator.prototype.execute = function(context, callback, args) {
  args = Array.prototype.slice.call(arguments, 2);

  return Q.when(getElement(context).then(function(element) {
    return element.getDriver().executeScript(function(element, callback, args) {
      return eval('(' + callback + ')').apply(element, args);
    }, element, callback, args);
  }));
};

/**
 * @param {Promise.<webdriver.WebElement>} context
 * @param {string|function} locator
 * @returns {Promise.<Array.<webdriver.WebElement>>}
 */
Evaluator.prototype.find = function(context, locator) {
  if (typeof locator === 'function') {
    return this.execute(context, locator);
  } else {
    return getElement(context).then(function(element) {
      return element.getAttribute('data-tinto-id').then(function(id) {
        return element.findElements({css: locator.replace(':scope', '[data-tinto-id="' + id + '"]')});
      });
    });
  }
};

/**
 * @private
 * @param {Promise.<webdriver.WebElement>} context
 * @returns {Promise.<webdriver.WebElement>}
 */
function getElement(context) {
  return context.then(function(element) {
    if (element === undefined) {
      // TODO: improve error message with meta info
      throw new ElementNotFoundError();
    }

    // TODO: check if element still exists

    return element;
  });
}

module.exports = new Evaluator();
