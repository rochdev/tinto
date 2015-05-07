'use strict';

var $ = require('jquery');
var Q = require('q');

/**
 * @constructor
 */
function Evaluator() {}

/**
 * @param {webdriver.WebElementPromise} context
 * @param {function} callback
 * @param {...*} [args]
 * @returns {Promise.<*>}
 */
Evaluator.prototype.execute = function(context, callback, args) {
  args = Array.prototype.slice.call(arguments, 2);

  return Q.when(context.then(function(element) {
    return element.getDriver().executeScript(function(element, $, callback, args) {
      return eval('(' + callback + ')').apply(element, args);
    }, element, $, callback, args);
  }));
};

module.exports = new Evaluator();
