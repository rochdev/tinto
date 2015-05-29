'use strict';

// TODO: collection assertions

var Q = require('q');
var extend = require('./utils/extend');
var mixin = require('./utils/mixin');
var Locator = require('./utils/locator');
var tinto = {};

/**
 * @param {T} type
 * @param {webdriver.WebDriver} driver
 * @param {tinto.Locator} locator
 * @template T
 * @constructor
 */
tinto.ComponentCollection = function ComponentCollection(type, locator) {
  var self = this;

  this._type = type;
  this._locator = locator;

  mixin(proxy, this);

  function proxy(index) {
    return self.at(index);
  }

  return proxy;
};

/**
 * @param {Object} [protoProps]
 * @param {Object} [staticProps]
 * @returns {function(this:tinto.ComponentCollection,new:tinto.Component,Promise)}
 */
tinto.ComponentCollection.extend = function(protoProps, staticProps) {
  return extend.call(this, protoProps, staticProps);
};

/**
 * @param {T} type
 * @returns {tinto.ComponentCollection.Builder.<T>}
 */
tinto.ComponentCollection.of = function of(type) {
  return new tinto.ComponentCollection.Builder(type);
};

/**
 * @template T
 * @param {T} type
 * @returns {tinto.ComponentCollection.<T>}
 */
tinto.ComponentCollection.prototype.asListOf = function asListOf(type) {
  return tinto.ComponentCollection.of(type).from(this);
};

/**
 * @param {Number} index
 * @returns {T}
 */
tinto.ComponentCollection.prototype.at = function(index) {
  return locate.call(this, index);
};

/**
 * @returns {T}
 */
tinto.ComponentCollection.prototype.first = function() {
  return this.at(0);
};

/**
 * @returns {T}
 */
tinto.ComponentCollection.prototype.last = function() {
  return locate.call(this, -1);
};

/**
 * @param {function(tinto.Component, Number)} callback
 * @returns {Promise}
 */
tinto.ComponentCollection.prototype.each = function(callback) {
  var self = this;

  return this.getElements().then(function(elements) {
    elements.forEach(function(value, index) {
      callback.call(value, new self._type(Q.resolve(value)), index);
    });
  });
};

/**
 * @param {function(tinto.Component, Number)} callback
 * @returns {Promise.<*>}
 */
tinto.ComponentCollection.prototype.map = function(callback) {
  var self = this;

  return this.getElements().then(function(elements) {
    return elements.map(function(value, index) {
      return callback.call(value, new self._type(Q.resolve(value)), index);
    });
  });
};

/**
 * @returns {Promise.<Number>}
 */
tinto.ComponentCollection.prototype.count = function() {
  return this.getElements().then(function(collection) {
    return collection.length;
  });
};

/**
 * @returns {Promise.<Array.<webdriver.WebElement>>}
 */
tinto.ComponentCollection.prototype.getElements = function() {
  return this._locator.locate();
};

/**
 * @param {T} type
 * @template T
 * @constructor
 */
tinto.ComponentCollection.Builder = function ComponentCollectionBuilder(type) {
  this._type = type;
};

/**
 * @param {tinto.ComponentCollection.<T>} components
 * @returns {tinto.ComponentCollection.<T>}
 */
tinto.ComponentCollection.Builder.prototype.from = function from(components) {
  return new tinto.ComponentCollection(this._type, components._locator);
};

/**
 * @private
 * @param {Number} index
 * @returns {T}
 */
function locate(index) {
  return new this._type(new Locator(this._locator.parent, this._locator.selector, index));
}

module.exports = tinto.ComponentCollection;
