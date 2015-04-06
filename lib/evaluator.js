'use strict';

var webdriver = require('selenium-webdriver');
var Q = require('q');
var Component = require('./component');
var queue = require('./queue');
var tinto = {};

/**
 * @constructor
 */
tinto.Evaluator = function Evaluator() {
  this._driver = null;
};

/**
 * @param {string} url
 * @returns {Promise}
 */
tinto.Evaluator.prototype.open = function(url) {
  if (this._driver === null) {
    // TODO: move this out of here and make a configuration
    this._driver = new webdriver.Builder()
      .forBrowser('firefox')
      .build();
  }

  var promise = this._driver.get(url);

  queue.push(promise);

  return promise;
};

/**
 * @param {Boolean} [force]
 * @returns {Promise}
 */
tinto.Evaluator.prototype.close = function(force) {
  var callback = this._driver ? this._driver.close : Q.resolve;

  this._driver = null;

  if (force) {
    return callback();
  } else {
    return queue.process().then(callback);
  }
};

/**
 * @param {string} selector
 * @returns {tinto.Component}
 */
tinto.Evaluator.prototype.find = function(selector) {
  return new Component(this._driver.findElement({css: selector}));
};

module.exports = tinto.Evaluator;
