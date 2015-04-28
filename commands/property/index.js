'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

module.exports = function(name) {
  if (name) {
    return generate(name);
  }

  inquirer.prompt([
    {
      name: 'name',
      message: 'What is the property name?',
      validate: function(value) {
        return value.trim().length > 0 || 'Please enter a name for this property';
      }
    }
  ], function(answers) {
    generate(answers.name);
  });

  function generate(name) {
    var template = asset('property.js')
      .replace(/\$name\$/g, name);
    var filename = _.kebabCase(name) + '.js';

    fs.writeFileSync(filename, template);

    console.log('New property added to ' + path.resolve(filename));
  }

  function asset(filename) {
    return fs.readFileSync(__dirname + '/assets/' + filename, {
      encoding: 'utf8'
    });
  }
};
