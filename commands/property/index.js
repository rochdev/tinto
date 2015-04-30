'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

module.exports = function(name) {
  inquirer.prompt([
    {
      name: 'name',
      message: 'What is the property name?',
      validate: function(value) {
        return value.trim().length > 0 || 'Please enter a name for this property';
      },
      when: function() {
        return !name;
      }
    },
    {
      name: 'bundle',
      message: 'What is the bundle name for this property (leave blank for none)?'
    }
  ], function(answers) {
    if (name) {
      answers.name = name;
    }

    var template = asset('property.js')
      .replace(/\$fn\$/g, answers.name)
      .replace(/\$name\$/g, (answers.bundle ? 'tinto.' + answers.bundle + '.properties.' : '') + answers.name);
    var filename = _.kebabCase(answers.name) + '.js';

    fs.writeFileSync(filename, template);

    console.log('New property added to ' + path.resolve(filename));
  });

  function asset(filename) {
    return fs.readFileSync(__dirname + '/assets/' + filename, {
      encoding: 'utf8'
    });
  }
};
