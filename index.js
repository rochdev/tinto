'use strict';

// TODO: refactor JSDoc
// TODO: add tests

var chai = require('chai');
var queue = require('./lib/queue');
var PropertyAssertion = require('./lib/assertions/property-assertion');
var StateAssertion = require('./lib/assertions/state-assertion');
var tinto = require('./lib/tinto');
var bundle = require('./lib/utils/bundle');
var config = require('./lib/utils/config');
var html = require('./lib/html');

module.exports = tinto;
global.tinto = tinto;

module.exports.Component = require('./lib/component');
module.exports.Page = require('./lib/page');
module.exports.ComponentCollection = require('./lib/component-collection');
module.exports.Browser = require('./lib/browser');

var browser = new module.exports.Browser();

module.exports.browser = browser;
module.exports.pause = require('./lib/utils/pause');
module.exports.sleep = require('./lib/utils/sleep');
module.exports.find = require('./lib/utils/find');
module.exports.inherits = require('./lib/utils/inherits');
module.exports.bundle = bundle;
module.exports.keyboard = require('./lib/utils/keyboard');
module.exports.done = queue.process.bind(queue);
module.exports.be = require('./lib/utils/delegate');
module.exports.have = require('./lib/utils/delegate');
module.exports.load = require('./lib/utils/load');
module.exports.waitFor = require('./lib/utils/wait-for');
module.exports.waitUntil = require('./lib/utils/wait-for');
// TODO: not with negate=true

/**
 * @name tinto.page
 * @type {tinto.Page}
 */
Object.defineProperty(module.exports, 'page', {
  get: browser.getPage.bind(browser)
});

// TODO: replace with built in assertions
chai.use(require('./lib/assertions'));

// Default bundle
bundle('html', html);

// Load user config
config.load();
