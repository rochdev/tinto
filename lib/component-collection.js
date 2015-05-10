'use strict';

// TODO: collection assertions

var util = require('util');
var Q = require('q');
var extend = require('./utils/extend');
var tinto = {};

/**
 * @param {T} type
 * @param {Promise} elements
 * @template T
 * @constructor
 */
tinto.ComponentCollection = function ComponentCollection(type, elements) {
  this._type = type;
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
 * @param {T} type
 * @returns {tinto.ComponentCollection.Builder.<T>}
 */
tinto.ComponentCollection.of = function of(type) {
  return new tinto.ComponentCollection.Builder(type);
};

/**
 * @param {Number} index
 * @returns {T}
 */
tinto.ComponentCollection.prototype.at = function(index) {
  return new this._type(this._elements.then(function(elements) {
    if (!elements[index]) {
      throw new Error(util.format('No component available at index %s', index));
    }

    return elements[index];
  }));
};

/**
 * @param {function(tinto.Component, Number)} callback
 * @returns {Promise}
 */
tinto.ComponentCollection.prototype.each = function(callback) {
  var self = this;

  return this._elements.then(function(elements) {
    elements.forEach(function(value, index) {
      callback(new self._type(Q.resolve(value)), index);
    });
  });
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
  return new tinto.ComponentCollection(this._type, components._elements);
};

module.exports = tinto.ComponentCollection;
