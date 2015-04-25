'use strict';

// TODO: support find() by Component class and instance
// TODO: make property/state definitions easier
// TODO: refactor constructor to take a Locator or locatorFn

var _ = require('lodash');
var util = require('util');
var Q = require('q');
var queue = require('./queue');
var bundles = require('./bundles');
var Attribute = require('./attribute');
var AssertionResult = require('./assertion-result');
var ComponentCollection = require('./component-collection');
var html = require('./html');
var extend = require('./utils/extend');
var getters = require('./utils/getters');
var should = require('./utils/should');
var $ = require('jquery');
var tinto = {};

/**
 * @param {Promise} element
 * @constructor
 */
tinto.Component = function Component(element) {
  this._element = element;
  this._properties = {};
  this._states = {};

  this.getter('should', should);
  this.state('empty', html.states.empty);
  this.property('value', html.properties.value);
  this.property('text', html.properties.text);
};

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
 * @param {string} state
 * @returns {function() : Promise.<Boolean>}
 */
tinto.Component.prototype.is = function(state) {
  var self = this;

  if (!this._states[state]) {
    throw new Error(util.format('Unsupported state "%s"', state));
  }

  return function() {
    return self._states[state].call(self).then(function(result) {
      return new AssertionResult(result, !result);
    });
  };
};

/**
 * @param {string} property
 * @param {*} expected
 * @returns {function() : Promise.<Boolean>}
 */
tinto.Component.prototype.has = function(property, expected) {
  var self = this;

  if (!this._properties[property]) {
    throw new Error(util.format('Unsupported property "%s"', property));
  }

  return function() {
    return self._properties[property].call(self).then(function(value) {
      return new AssertionResult(expected === value, value);
    });
  };
};

/**
 * @param {string} name
 * @param {function} [matcher]
 */
tinto.Component.prototype.state = function(name, matcher) {
  support.call(this, 'states', name, matcher, 'State "%s" does not exist');
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Component.prototype.states = function(mappings) {
  _.forEach(mappings, function(matcher, name) {
    this.state(name, matcher);
  }, this);
};

/**
 * @param {string} name
 * @param {function} [matcher]
 */
tinto.Component.prototype.property = function(name, matcher) {
  this.getter(name, function() {
    return new Attribute(getMatcher('property', name, matcher).apply(this, arguments));
  });

  support.call(this, 'properties', name, matcher, 'Property "%s" does not exist');
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Component.prototype.properties = function(mappings) {
  _.forEach(mappings, function(matcher, name) {
    this.property(name, matcher);
  }, this);
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
 * @returns {Promise.<string>}
 */
tinto.Component.prototype.getText = function() {
  return this._element.then(function(element) {
    return element.getText();
  });
};

/**
 * @param {string} name
 * @returns {Promise.<string>}
 */
tinto.Component.prototype.getAttribute = function(name) {
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

/**
 * @private
 * @param {function()} matcher
 * @returns {Function}
 */
function wrap(matcher) {
  return function() {
    return Q.when(matcher.apply(this, arguments));
  };
}

/**
 * @private
 * @param {string} type
 * @param {string} name
 * @param {function()} override
 * @returns {Function}
 */
function getMatcher(type, name, override) {
  if (override) {
    return wrap(override);
  } else {
    for (var i = bundles.length - 1; i >= 0; i--) {
      if (bundles[i][type][name]) {
        return wrap(bundles[i][type][name]);
      }
    }
  }
}

/**
 * @private
 * @param {string} type
 * @param {string} name
 * @param {function} matcher
 * @param {string} message
 */
function support(type, name, matcher, message) {
  this['_' + type][name] = getMatcher(type, name, matcher);

  if (!this['_' + type][name]) {
    throw new Error(util.format(message, name));
  }
}

module.exports = tinto.Component;
