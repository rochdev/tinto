'use strict';

// TODO: support find() by Component class and instance
// TODO: make property/state definitions easier
// TODO: refactor constructor to take a Locator or locatorFn

var util = require('util');
var Q = require('q');
var queue = require('./queue');
var Assertable = require('./assertable');
var ComponentCollection = require('./component-collection');
var html = require('./html');
var extend = require('./utils/extend');
var getters = require('./utils/getters');
var $ = require('jquery');
var tinto = {};

/**
 * @param {Promise} element
 * @constructor
 * @augments {tinto.Assertable}
 */
tinto.Component = function Component(element) {
  Assertable.call(this);

  this._element = element;

  this.state('empty', html.states.empty);
  this.property('value', html.properties.value);
  this.property('text', html.properties.text);
  this.getter('text', function() {
    return this._element.then(function(element) {
      return element.getText();
    });
  });
};

util.inherits(tinto.Component, Assertable);

/**
 * @param {Object} [protoProps]
 * @param {Object} [staticProps]
 * @returns {function(this:tinto.Component,new:tinto.Component,Promise)}
 */
tinto.Component.extend = function(protoProps, staticProps) {
  return extend.call(this, protoProps, staticProps);
};

/**
 * @param {tinto.Component} component
 * @returns {tinto.Component}
 */
tinto.Component.from = function(component) {
  return new this(component._element);
};

/**
 * @param {string} prop
 * @param {function()} func
 */
tinto.Component.prototype.getter = function(prop, func) {
  Object.defineProperty(this, prop, {
    get: func
  });
};

/**
 * @param {Object} props
 */
tinto.Component.prototype.getters = function(props) {
  getters(this, props);
};

/**
 * @param {string} name
 * @returns {Promise}
 */
tinto.Component.prototype.attr = function(name) {
  return this._element.then(function(element) {
    return element.getAttribute(name);
  });
};

/**
 * @returns {tinto.Component}
 */
tinto.Component.prototype.click = function() {
  var self = this;

  queue.push(function() {
    return self._element.then(function(element) {
      return element.click();
    });
  });

  return this;
};

/**
 * @param {...string} keys
 * @returns {tinto.Component}
 */
tinto.Component.prototype.enter = function(keys) {
  // TODO: add keys enum

  var self = this;

  keys = arguments;

  queue.push(function() {
    return self._element.then(function(element) {
      return element.sendKeys.apply(element, keys);
    });
  });
};

/**
 * @param {string} selector
 * @returns {tinto.ComponentCollection}
 */
tinto.Component.prototype.find = function(selector) {
  return new ComponentCollection(this._element.then(function(element) {
    return element.findElements({css: selector});
  }));
};

/**
 * @param {!function(this:tinto.Component)} callback
 * @param {...*} [args]
 * @returns {Promise}
 */
tinto.Component.prototype.execute = function(callback, args) {
  args = Array.prototype.slice.call(arguments, 1);

  return Q.when(this._element.then(function(element) {
    return element.getDriver().executeScript(function(element, $, callback, args) {
      return eval('(' + callback + ')').apply(element, args);
    }, element, $, callback, args);
  }));
};

module.exports = tinto.Component;
