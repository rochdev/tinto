'use strict';

var Page = require('./page');
var Entity = require('./entity');
var Locator = require('./utils/locator');
var queue = require('./queue');
var evaluator = require('./utils/evaluator');
var inherits = require('./utils/inherits');
var tinto = {};

/**
 * @constructor
 * @extends tinto.Entity
 * @property {tinto.Attribute} url
 */
tinto.Browser = function Browser() {
  Entity.call(this);

  this.property('url', function() {
    return evaluator.getDriver().getCurrentUrl();
  });
};

inherits(tinto.Browser, Entity);

/**
 * @returns {tinto.Page}
 */
tinto.Browser.prototype.getPage = function() {
  return new Page(new Locator(null, 'html', 0));
};

/**
 * @param {string} url
 */
tinto.Browser.prototype.open = function(url) {
  evaluator.open();
  queue.push(evaluator.getDriver().get(url));
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
