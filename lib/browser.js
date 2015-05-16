'use strict';

var webdriver = require('selenium-webdriver');
var Q = require('q');
var Page = require('./page');
var queue = require('./queue');
var tinto = {};

/**
 * @constructor
 */
tinto.Browser = function Browser() {
  this._driver = null;
};

/**
 * @returns {tinto.Page}
 */
tinto.Browser.prototype.getPage = function() {
  return new Page(this._driver.findElement({css: 'html'}));
};

/**
 * @param {string} url
 * @returns {Promise}
 */
tinto.Browser.prototype.open = function(url) {
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
tinto.Browser.prototype.close = function(force) {
  var callback = this._driver ? this._driver.close : Q.resolve;

  this._driver = null;

  if (force) {
    return callback();
  } else {
    return queue.process().then(callback);
  }
};

module.exports = tinto.Browser;
