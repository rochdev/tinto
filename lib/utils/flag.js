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
    value = utils.flag(object, name, value);
  });

  return value;
}

module.exports = flag;
