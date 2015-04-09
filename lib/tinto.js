'use strict';

var queue = require('./queue');

/**
 * @namespace tinto
 * @param {function()} stepFn
 * @returns {Function}
 */
function tinto(stepFn) {
  return scenario;

  function scenario() {
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
  }
}

module.exports = tinto;
