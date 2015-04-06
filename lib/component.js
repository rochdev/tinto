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

  this.supportState('empty', html.states.empty);
  this.supportProperty('value', html.properties.value);
  this.supportProperty('text', html.properties.text);
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
 * @param {string} name
 * @returns {Promise}
 */
tinto.Component.prototype.attr = function(name) {
  return this._element.then(function(element) {
    return element.getAttribute(name);
  });
};

/**
 * @returns {Promise}
 */
tinto.Component.prototype.text = function() {
  return this._element.then(function(element) {
    return element.getText();
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
 * @param {string} text
 * @returns {tinto.Component}
 */
tinto.Component.prototype.enter = function(text) {
  // TODO: add keys enum

  var self = this;

  queue.push(function() {
    return self._element.then(function(element) {
      return element.sendKeys(text);
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
