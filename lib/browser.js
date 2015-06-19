'use strict';

var Page = require('./page');
var Entity = require('./entity');
var Locator = require('./utils/locator');
var queue = require('./queue');
var evaluator = require('./utils/evaluator');
var inherits = require('./utils/inherits');
var find = require('./utils/find');
var tinto = {};

/**
 * @constructor
 * @extends tinto.Entity
 * @property {tinto.Attribute} title
 * @property {tinto.Attribute} url
 * @property {webdriver.WebDriver.Navigation} navigate
 */
tinto.Browser = function Browser() {
  Entity.call(this);

  this.property('url', function() {
    return evaluator.getDriver().getCurrentUrl();
  });

  this.property('title', function() {
    return find('title').first().getText();
  });

  this.getter('navigate', function() {
    return evaluator.getDriver().navigate();
  });
};

inherits(tinto.Browser, Entity);

/**
 * @returns {tinto.Page}
 */
tinto.Browser.prototype.getPage = function() {
  return new Page(new Locator('html', {index: 0}));
};

/**
 * @param {string} [url]
 */
tinto.Browser.prototype.open = function(url) {
  evaluator.open();

  if (url) {
    this.visit(url);
  }
};

/**
 * @param {string} url
 */
tinto.Browser.prototype.visit = function(url) {
  queue.push(function() {
    return evaluator.getDriver().get(url);
  });
};

/**
 * @param {Boolean} [force]
 */
tinto.Browser.prototype.close = function(force) {
  if (force) {
    queue.clear();
    evaluator.close();
  } else {
    queue.push(function() {
      return evaluator.close();
    });
  }
};

module.exports = tinto.Browser;
