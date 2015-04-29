'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var exec = require('child_process').exec;

module.exports = function(folder) {
  inquirer.prompt([
    {
      name: 'name',
      message: 'What is the bundle name?',
      default: function() {
        return folder || path.basename(process.cwd());
      },
      validate: function(value) {
        return value.trim().length > 0 || 'Please enter a name for this bundle';
      }
    },
    {
      name: 'username',
      message: 'What is your GitHub username?',
      default: function() {
        var done = this.async();

        exec('git config --global user.name', function(error, stdout) {
          done(error ? '' : stdout.trim());
        });
      },
      validate: function(value) {
        return value.trim().length > 0 || 'Please enter your GitHub username';
      }
    }
  ], function(answers) {
    var pkg = asset('package.json')
      .replace(/\$name\$/g, _.kebabCase(answers.name))
      .replace(/\$username\$/g, answers.username);
    var readme = asset('README.md')
      .replace(/\$name\$/g, _.kebabCase(answers.name));
    var index = asset('index.js')
      .replace(/\$name\$/g, _.camelCase(answers.name));
    var components = asset('components.js')
      .replace(/\$name\$/g, _.camelCase(answers.name));
    var properties = asset('properties.js')
      .replace(/\$name\$/g, _.camelCase(answers.name));
    var states = asset('states.js')
      .replace(/\$name\$/g, _.camelCase(answers.name));

    if (folder) {
      fs.mkdirSync(folder);
      process.chdir(folder);
    }

    copy('../../.editorconfig', '.editorconfig');
    copy('../../.gitignore', '.gitignore');
    copy('../../.jscsrc', '.jscsrc');
    copy('../../.jshintrc', '.jshintrc');

    write('package.json', pkg);
    write('README.md', readme);

    fs.mkdirSync('lib');
    fs.mkdirSync('lib/components');
    fs.mkdirSync('lib/properties');
    fs.mkdirSync('lib/states');
    fs.mkdirSync('test');
    fs.mkdirSync('test/components');
    fs.mkdirSync('test/properties');
    fs.mkdirSync('test/states');

    copy('../../test/.jshintrc', 'test/.jshintrc');

    write('lib/index.js', index);
    write('lib/components/index.js', components);
    write('lib/properties/index.js', properties);
    write('lib/states/index.js', states);

    console.log('New bundle "tinto-' + _.kebabCase(answers.name) + '" created');
  });

  function copy(source, destination) {
    write(destination, read(path.join(__dirname, source)));
  }

  function asset(filename) {
    return read(path.join(__dirname, 'assets', filename));
  }

  function read(filename) {
    return fs.readFileSync(filename, {
      encoding: 'utf8'
    });
  }

  function write(filename, data) {
    fs.writeFileSync(filename, data);
  }
};
