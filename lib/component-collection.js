'use strict';

// TODO: collection assertions

var util = require('util');
var Q = require('q');
var extend = require('./utils/extend');
var tinto = {};

/**
 * @param {Promise} elements
 * @constructor
 */
tinto.ComponentCollection = function ComponentCollection(elements) {
  this._elements = elements;

  /** @type Promise.<Number> */
  Object.defineProperty(this, 'length', {
    get: function() {
      return elements.then(function(collection) {
        return collection.length;
      });
    }
  });
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
 * @param {Number} index
 * @returns {tinto.Component}
 */
tinto.ComponentCollection.prototype.at = function(index) {
  // TODO: find a way to avoid local require
  var Component = require('./component');

  return new Component(this._elements.then(function(elements) {
    if (!elements[index]) {
      // TODO: find a better way to handle this
      throw new Error(util.format('No component available at index %s', index));
    }

    return elements[index];
  }));
};

/**
 * @param {function(tinto.Component, Number)} callback
 * @returns {*}
 */
tinto.ComponentCollection.prototype.each = function(callback) {
  var Component = require('./component');

  return this._elements.then(function(elements) {
    elements.forEach(function(value, index) {
      callback(new Component(Q.resolve(value)), index);
    });
  });
};

module.exports = tinto.ComponentCollection;
