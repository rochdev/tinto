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

    if (!this.__tinto__) {
      Object.defineProperty(this, '__tinto__', {
        value: true
      });

      this.Before = function defineBeforeHook() {
        return wrap(before, arguments);
      };

      this.After = function defineAfterHook() {
        return wrap(after, arguments);
      };

      this.Around = function defineAroundHook() {
        return wrap(around, arguments);
      };

      this.Given = this.When = this.Then = function defineStep() {
        return wrap(given, arguments);
      };
    }

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
    var args = Array.prototype.slice.call(arguments, 0);

    code.apply(this, args);

    return queue.process();
  };

  return method.apply(this, args.concat(codeWrapper));
}

module.exports = tinto;
