'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var chai = require('chai');
var bundle = require('./bundle');

var config = null;
var defaults = {
  includeStack: false,
  bundles: {},
  browser: 'firefox'
};
var root = findRoot(process.cwd());

module.exports = {
  get: function(key) {
    if (!config) {
      config = root ? _.merge({}, defaults, require(path.join(root, 'tinto.conf.js'))) : defaults;
    }

    return config[key];
  },

  load: function() {
    loadIncludeStack(this.get('includeStack'));
    loadBundles(this.get('bundles'));
  }
};

function findRoot(dir) {
  try {
    fs.statSync(path.join(dir, 'tinto.conf.js'));

    return dir;
  } catch (e) {
    var parent = path.resolve(dir, '..');

    if (parent === dir) {
      return null;
    }

    return findRoot(parent);
  }
}

function loadIncludeStack(value) {
  chai.config.includeStack = !!value;
}

function loadBundles(bundles) {
  _.forIn(bundles, function(definition, name) {
    if (typeof definition === 'string') {
      if (definition.charAt(0) === '.') {
        definition = require(path.join(root, definition));
      } else {
        definition = require(path.join(root, 'node_modules', definition));
      }
    }

    bundle(name, definition);
  });
}
