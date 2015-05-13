'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

module.exports = function(name) {
  inquirer.prompt([
    {
      name: 'name',
      message: 'What is the state name?',
      validate: function(value) {
        return value.trim().length > 0 || 'Please enter a name for this state';
      },
      when: function() {
        return !name;
      }
    },
    {
      name: 'bundle',
      message: 'What is the bundle name for this state (leave blank for none)?'
    }
  ], function(answers) {
    if (name) {
      answers.name = name;
    }

    var template = asset('state.js')
      .replace(/\$fn\$/g, answers.name)
      .replace(/\$memberof\$/g, answers.bundle ? '\n * @memberOf tinto.' + answers.bundle + '.states' : '');
    var filename = _.kebabCase(answers.name) + '.js';

    fs.writeFileSync(filename, template);

    console.log('New state added to ' + path.resolve(filename));
  });

  function asset(filename) {
    return fs.readFileSync(__dirname + '/assets/' + filename, {
      encoding: 'utf8'
    });
  }
};
