'use strict';

var _ = require('lodash');
var webdriver = require('selenium-webdriver');
var Q = require('q');
var util = require('util');
var Page = require('./page');
var AssertionResult = require('./assertion-result');
var PropertyAssertion = require('./assertions/property-assertion');
var queue = require('./queue');
var should = require('./utils/should');
var tinto = {};

/**
 * @constructor
 */
tinto.Browser = function Browser() {
  var self = this;

  this._driver = null;

  PropertyAssertion.register('url');

  /**
   * @name tinto.Browser#url
   * @type {Promise.<string>}
   */
  Object.defineProperty(this, 'url', {
    get: function() {
      return self._driver.getCurrentUrl();
    }
  });

  /**
   * @name tinto.Browser#should
   * @type {tinto.Assertion}
   */

  /**
   * @name tinto.Browser#should
   * @function
   * @param {...tinto.Assertion} assertions
   */
  Object.defineProperty(this, 'should', {
    get: should
  });
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

/**
 * @param {string} property
 * @param {*} expected
 * @returns {function() : Promise.<AssertionResult>}
 */
tinto.Browser.prototype.has = function(property, expected) {
  // TODO: make an assertable class instead and use it both here and in Component
  var self = this;

  if (!self[property]) {
    throw new Error(util.format('Unsupported property "%s"', property));
  }

  return function() {
    return self[property].then(function(actual) {
      return new AssertionResult(_.isEqual(expected, actual), expected, actual);
    });
  };
};

module.exports = tinto.Browser;
