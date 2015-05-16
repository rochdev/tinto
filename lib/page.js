'use strict';

var Component = require('./component');
var inherits = require('./utils/inherits');
var tinto = {};

/**
 * @param {Promise.<webdriver.WebElement>} locator
 * @constructor
 * @extends tinto.Component
 * @property {tinto.Attribute} title
 */
tinto.Page = function Page(locator) {
  Component.call(this, locator);

  this.property('title', function() {
    return this.find('title').first().getText();
  });
};

inherits(tinto.Page, Component);

module.exports = tinto.Page;
