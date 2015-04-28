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
      message: 'What is the state name?',
      validate: function(value) {
        return value.trim().length > 0 || 'Please enter a name for this state';
      }
    }
  ], function(answers) {
    generate(answers.name);
  });

  function generate(name) {
    var template = asset('state.js')
      .replace(/\$name\$/g, name);
    var filename = _.kebabCase(name) + '.js';

    fs.writeFileSync(filename, template);

    console.log('New state added to ' + path.resolve(filename));
  }

  function asset(filename) {
    return fs.readFileSync(__dirname + '/assets/' + filename, {
      encoding: 'utf8'
    });
  }
};
