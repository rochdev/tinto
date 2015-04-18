'use strict';

var chai = require('chai');
var expectation = chai.expect(null);

chai.use(function(chai, utils) {
  utils.flag(expectation, 'delegate', true);
});

module.exports = expectation;
