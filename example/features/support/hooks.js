'use strict';

var tinto = require('../../../index');

module.exports = tinto(function() {
  this.After(function() {
    tinto.browser.close();
  });
});
