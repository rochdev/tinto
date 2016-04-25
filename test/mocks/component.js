'use strict';

var _ = require('lodash');
var sinon = require('sinon');
var Q = require('q');
var descriptors = require('../../lib/utils/descriptors');

function Component() {}

Component.prototype.find = sinon.stub();

Component.prototype.getText = sinon.spy(function() {
  return Q.resolve('text');
});

Component.prototype.getter = sinon.spy(function(name, fn) {
  Object.defineProperty(this, name, {
    get: fn
  });
});

Component.prototype.getters = sinon.spy(function(props) {
  _.forIn(descriptors(props), function(descriptor, prop) {
    if (descriptor.get) {
      this.getter(prop, descriptor.get);
    } else if (descriptor.value && typeof descriptor.value === 'function') {
      this.getter(prop, descriptor.value);
    }
  }.bind(this));
});

Component.prototype.property = sinon.spy(function(name, matcher) {
  this.getter(name, matcher);
});

module.exports = Component;
