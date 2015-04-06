'use strict';

// TODO: refactor JSDoc
// TODO: add tests

var chai = require('chai');
var webdriver = require('selenium-webdriver');
var queue = require('./queue');
var PropertyAssertion = require('./assertions/property-assertion');
var StateAssertion = require('./assertions/state-assertion');

function tinto(stepFn) {
  return function() {
    var given = this.Given;

    this.Given = this.When = this.Then = function defineStep(name, code) {
      var codeWrapper = function() {
        var callback = Array.prototype.pop.call(arguments);
        var args = Array.prototype.slice.call(arguments, 0);

        code.apply(this, args);

        queue.process().then(callback).done();
      };

      given.call(this, name, codeWrapper);
    };

    return stepFn.apply(this, arguments);
  };
}

tinto.Component = require('./component');
tinto.ComponentCollection = require('./component-collection');
tinto.Evaluator = require('./evaluator');

// TODO: remove this from public interface
/** @type {tinto.Evaluator} */
tinto.evaluator = new tinto.Evaluator();

tinto.key = webdriver.Key;

tinto.open = tinto.evaluator.open.bind(tinto.evaluator);
tinto.close = tinto.evaluator.close.bind(tinto.evaluator);
tinto.done = queue.process.bind(queue);

// TODO: replace with built in assertions
chai.use(require('../lib/assertions'));

// Default states
StateAssertion.register('empty');

// Default properties
PropertyAssertion.register('text');
PropertyAssertion.register('value');

module.exports = tinto;
