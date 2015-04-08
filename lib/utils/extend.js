'use strict';

var _ = require('lodash');

/** @type function */
module.exports = function(protoProps, staticProps) {
  var parent = this;
  var child;

  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function() {
      return parent.apply(this, arguments);
    };
  }

  _.extend(child, parent, staticProps);

  child.prototype = Object.create(parent.prototype);

  if (protoProps) {
    Object.getOwnPropertyNames(protoProps).forEach(function(prop) {
      Object.defineProperty(child.prototype, prop, Object.getOwnPropertyDescriptor(protoProps, prop));
    });
  }

  return child;
};
