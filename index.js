'use strict';

// TODO: refactor JSDoc
// TODO: add tests

var chai = require('chai');
var queue = require('./lib/queue');
var PropertyAssertion = require('./lib/assertions/property-assertion');
var StateAssertion = require('./lib/assertions/state-assertion');
var tinto = require('./lib/tinto');
var bundle = require('./lib/utils/bundle');
var html = require('./lib/html');

module.exports = tinto;

module.exports.Component = require('./lib/component');
module.exports.ComponentCollection = require('./lib/component-collection');
module.exports.Browser = require('./lib/browser');

var browser = new module.exports.Browser();

module.exports.browser = browser;
module.exports.inherits = require('./lib/utils/inherits');
module.exports.bundle = bundle;
module.exports.keyboard = require('./lib/utils/keyboard');
module.exports.done = queue.process.bind(queue);
module.exports.be = require('./lib/utils/delegate');
module.exports.have = require('./lib/utils/delegate');
module.exports.load = require('./lib/utils/load');
// TODO: not with negate=true

// TODO: replace with built in assertions
chai.use(require('./lib/assertions'));

// Default bundle
bundle('html', html);
