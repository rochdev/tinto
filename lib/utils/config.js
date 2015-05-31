'use strict';

var _ = require('lodash');
var path = require('path');
var bundle = require('./bundle');

var config = null;
var defaults = {
  bundles: {}
};

module.exports = {
  get: function(key) {
    if (!config) {
      config = find(process.cwd());
    }

    return config[key];
  },

  load: function() {
    loadBundles(this.get('bundles'));
  }
};

function find(dir) {
  try {
    return _.merge({}, defaults, require(path.join(dir, 'tinto.conf.js')));
  } catch (e) {
    var parent = path.resolve(dir, '..');

    if (parent === dir) {
      return defaults;
    }

    return find(parent);
  }
}

function loadBundles(bundles) {
  _.forIn(bundles, function(definition, name) {
    bundle(name, definition);
  });
}
