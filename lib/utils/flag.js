'use strict';

var chai = require('chai');

/**
 * @private
 * @param {*} object
 * @param {string} name
 * @param {*} [value]
 * @returns {*}
 */
function flag(object, name, value) {
  chai.use(function(chai, utils) {
    value = value !== undefined ? utils.flag(object, name, value) : utils.flag(object, name);
  });

  return value;
}

module.exports = flag;
