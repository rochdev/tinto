'use strict';

// TODO: support find() by Component class and instance
// TODO: refactor constructor to take a Locator or locatorFn

var _ = require('lodash');
var util = require('util');
var uuid = require('node-uuid');
var Q = require('q');
var queue = require('./queue');
var Attribute = require('./attribute');
var AssertionResult = require('./assertion-result');
var PropertyAssertion = require('./assertions/property-assertion');
var StateAssertion = require('./assertions/state-assertion');
var CountAssertion = require('./assertions/count-assertion');
var ComponentCollection = require('./component-collection');
var extend = require('./utils/extend');
var descriptors = require('./utils/descriptors');
var should = require('./utils/should');
var evaluator = require('./utils/evaluator');
var bundles = require('./tinto');
var tinto = {};

/**
 * @param {Promise} element
 * @constructor
 */
tinto.Component = function Component(element) {
  var self = this;

  this.__id__ = null;
  this._properties = {};
  this._states = {};
  this._element = evaluator.execute(element, function(id) {
    id = this.getAttribute('data-tinto-id') || id;

    this.setAttribute('data-tinto-id', id);

    return id;
  }, uuid.v4()).then(function(id) {
    self.__id__ = id;

    return element;
  });

  this.state('available', available);
  this.state('missing', missing);

  /**
   * @name tinto.Component#should
   * @type {tinto.ComponentAssertion}
   */

  /**
   * @name tinto.Component#should
   * @function
   * @param {...tinto.Assertion} assertions
   */
  Object.defineProperty(this, 'should', {
    get: should
  });

  process.nextTick(function() {
    _.forIn(descriptors(self), function(descriptor, prop) {
      descriptor.get && CountAssertion.register(prop);
    });
  });
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
 * @returns {string}
 */
tinto.Component.prototype.toString = function() {
  return '[' + this.constructor.name + ':' + this.__id__ + ']';
};

/**
 * @template T
 * @param {T} type
 * @returns {T}
 */
tinto.Component.prototype.as = function(type) {
  return tinto.Component.from.call(type, this);
};

/**
 * @param {string} state
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
tinto.Component.prototype.is = function(state) {
  var self = this;

  if (!this._states[state]) {
    throw new Error(util.format('Unsupported state "%s"', state));
  }

  return function() {
    return self._states[state].call(self).then(function(result) {
      return new AssertionResult(result);
    });
  };
};

/**
 * @param {string} property
 * @param {*} expected
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
tinto.Component.prototype.has = function(property, expected) {
  if (typeof property === 'number') {
    return hasCount.call(this, expected, property);
  } else {
    return hasValue.call(this, property, expected);
  }
};

/**
 * @param {...tinto.Component} components
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
tinto.Component.prototype.contains = function(components) {
  var self = this;

  components = Array.prototype.slice.call(arguments, 0);

  return function() {
    return Q.all(components.map(function(component) {
      return component._element.then(function(element) {
        return self.execute(function(element) {
          return this.contains(element);
        }, element).then(function(result) {
          return new AssertionResult(result, component.toString());
        });
      });
    }));
  };
};

/**
 * @param {tinto.Component} component
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
tinto.Component.prototype.equals = function(component) {
  var self = this;

  return function() {
    return component._element.then(function(element) {
      return self.execute(function(element) {
        return this === element;
      }, element).then(function(result) {
        return new AssertionResult(result, component.toString(), self.toString());
      });
    });
  };
};

/**
 * @param {string} name
 * @param {function} [matcher]
 * @param {Array.<*>} [args]
 */
tinto.Component.prototype.state = function(name, matcher, args) {
  StateAssertion.register(name);

  support.call(this, 'states', name, matcher, args, 'State "%s" does not exist');
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Component.prototype.states = function() {
  processMappings.call(this, 'state', arguments);
};

/**
 * @param {string} name
 * @param {function} [matcher]
 * @param {Array.<*>} [args]
 */
tinto.Component.prototype.property = function(name, matcher, args) {
  matcher = support.call(this, 'properties', name, matcher, args, 'Property "%s" does not exist');

  PropertyAssertion.register(name);

  this.getter(name, function() {
    return new Attribute(this, name, matcher.call(this));
  });
};

/**
 * @param {Object.<string, function>} mappings
 */
tinto.Component.prototype.properties = function() {
  processMappings.call(this, 'property', arguments);
};

/**
 * @param {string} prop
 * @param {function()} func
 */
tinto.Component.prototype.getter = function(prop, func) {
  Object.defineProperty(this, prop, {
    get: func,
    enumerable: true,
    configurable: true
  });
};

/**
 * @param {Object} props
 */
tinto.Component.prototype.getters = function(props) {
  _.forIn(descriptors(props), function(descriptor, prop) {
    if (descriptor.get) {
      this.getter(prop, descriptor.get);
    } else if (descriptor.value && typeof descriptor.value === 'function') {
      this.getter(prop, descriptor.value);
    }
  }, this);
};

/**
 * @returns {Promise.<webdriver.WebElement>}
 */
tinto.Component.prototype.getElement = function() {
  return this._element;
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
  var self = this;

  keys = arguments;

  queue.push(function() {
    return self._element.then(function(element) {
      return element.sendKeys.apply(element, keys);
    });
  });
};

/**
 * @param {string|function} locator
 * @returns {tinto.ComponentCollection.<tinto.Component>}
 */
tinto.Component.prototype.find = function(locator) {
  return new ComponentCollection(tinto.Component, evaluator.find(this._element, locator));
};

/**
 * @param {!function(this:tinto.Component)} callback
 * @param {...*} [args]
 * @returns {Promise}
 */
tinto.Component.prototype.execute = function(callback, args) {
  args = Array.prototype.slice.call(arguments, 0);

  return evaluator.execute.apply(evaluator, [this._element].concat(args));
};

/**
 * @private
 * @param {function()} matcher
 * @param {Array.<*>} args
 * @returns {Function}
 */
function wrap(matcher, args) {
  return function() {
    return Q.when(args ? matcher.apply(this, args) : matcher.call(this));
  };
}

/**
 * @private
 * @param {string} type
 * @param {string} name
 * @param {function} matcher
 * @param {Array.<*>} args
 * @param {string} message
 */
function support(type, name, matcher, args, message) {
  if (matcher instanceof Array) {
    args = matcher;
    matcher = null;
  }

  if (!matcher && this.__bundle__) {
    matcher = bundles[this.__bundle__][type] && bundles[this.__bundle__][type][name];
  }

  if (!matcher) {
    matcher = bundles.html[type] && bundles.html[type][name];
  }

  if (!matcher) {
    throw new Error(util.format(message, name));
  }

  return (this['_' + type][name] = wrap(matcher, args));
}

/**
 * @private
 * @param {string} property
 * @param {*} value
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
function hasValue(property, value) {
  var self = this;

  if (!this._properties[property]) {
    throw new Error(util.format('Unsupported property "%s"', property));
  }

  return function() {
    return self._properties[property].call(self).then(function(actual) {
      return new AssertionResult(_.isEqual(value, actual), value, actual);
    });
  };
}

/**
 * @private
 * @param {string} property
 * @param {Number} count
 * @returns {function() : Promise.<tinto.AssertionResult>}
 */
function hasCount(property, count) {
  var collection = this[property];

  if (typeof collection !== 'object' || collection.length === undefined) {
    throw new Error('Count assertions can only be applied to collections');
  }

  return function() {
    return Q.resolve(collection.length).then(function(length) {
      return new AssertionResult(count === length, count, length);
    });
  };
}

/**
 * @private
 * @param {string} type
 * @param {Array.<string|Object>} mappings
 */
function processMappings(type, mappings) {
  var self = this;

  mappings = Array.prototype.slice.call(mappings, 0);
  mappings.forEach(function(mapping) {
    if (typeof mapping === 'string') {
      self[type](mapping);
    } else {
      _.forEach(mapping, function(matcher, name) {
        self[type](name, matcher);
      }, self);
    }
  });
}

/**
 * @private
 * @this tinto.Component
 * @returns {Promise.<Boolean>}
 */
function available() {
  return this.is('missing')().then(function(result) {
    return !result.outcome;
  });
}

/**
 * @private
 * @this tinto.Component
 * @returns {Promise.<Boolean>}
 */
function missing() {
  return this._element.then(function() {
    return false;
  }).catch(function() {
    return true;
  });
}

module.exports = tinto.Component;
