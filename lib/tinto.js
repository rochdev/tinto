'use strict';

var queue = require('./queue');

/**
 * @namespace tinto
 * @param {function()} stepFn
 * @returns {Function}
 */
function tinto(stepFn) {
  /**
   * @private
   * @returns {*}
   */
  return function scenario() {
    var given = this.Given;
    var before = this.Before;
    var after = this.After;
    var around = this.Around;

    this.Before = function defineBeforeHook() {
      wrap(before, arguments);
    };

    this.After = function defineAfterHook() {
      wrap(after, arguments);
    };

    this.Around = function defineAroundHook() {
      wrap(around, arguments);
    };

    this.Given = this.When = this.Then = function defineStep() {
      wrap(given, arguments);
    };

    return stepFn.apply(this, arguments);
  };
}

/**
 * @private
 * @param {function} method
 * @param {Array} args
 * @returns {function}
 */
function wrap(method, args) {
  var code = Array.prototype.pop.call(args);

  args = Array.prototype.slice.call(args, 0);

  var codeWrapper = function() {
    var callback = Array.prototype.pop.call(arguments);
    var others = Array.prototype.slice.call(arguments, 0);

    code.apply(this, others);

    queue.process().then(callback).done();
  };

  method.apply(this, args.concat(codeWrapper));
}

module.exports = tinto;
