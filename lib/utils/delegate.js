'use strict';

var chai = require('chai');
var flag = require('./flag');
var expectation = chai.expect(null);

flag(expectation, 'delegate', true);

module.exports = expectation;
