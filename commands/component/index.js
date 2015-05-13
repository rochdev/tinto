'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

module.exports = function() {
  inquirer.prompt([
    {
      name: 'name',
      message: 'What is the component (class) name?',
      validate: function(value) {
        return value.trim().length > 0 || 'Please enter a name for this component';
      }
    },
    {
      name: 'super',
      message: 'What is the base class for this component?',
      default: 'tinto.Component',
      validate: function(value) {
        return value.trim().length > 0 || 'All components must inherit at least from Component';
      }
    },
    {
      name: 'bundle',
      message: 'What is the bundle name of this component (leave blank for none)?'
    },
    {
      name: 'syntax',
      message: 'Which syntax would you like to use?',
      type: 'list',
      choices: [
        {
          name: 'ES5',
          value: 'es5'
        },
        {
          name: 'ES6',
          value: 'es6'
        },
        {
          name: '.extend',
          value: 'extend'
        }
      ]
    }
  ], function(answers) {
    var doc = asset('docblock.js').trim();
    var template = asset('component.' + answers.syntax + '.js')
      .replace(/\$doc\$/g, doc)
      .replace(/\$class\$/g, answers.name)
      .replace(/\$super\$/g, answers.super)
      .replace(/\$memberof\$/g, answers.bundle ? '\n * @memberOf tinto.' + answers.bundle + '.components' : '');
    var filename = _.kebabCase(answers.name) + '.js';

    fs.writeFileSync(filename, template);

    console.log('New component added to ' + path.resolve(filename));
  });

  function asset(filename) {
    return fs.readFileSync(__dirname + '/assets/' + filename, {
      encoding: 'utf8'
    });
  }
};
