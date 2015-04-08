'use strict';

var _ = require('lodash');
var getters = require('./getters');

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
    getters(child.prototype, protoProps);
  }

  return child;
};
