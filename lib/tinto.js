'use strict';

/* jshint unused:false */
var queue = require('./queue');

/**
 * @namespace tinto
 * @param {function()} stepFn
 * @returns {function()}
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
 * @param {function()} method
 * @param {Array} args
 * @returns {function()}
 */
function wrap(method, args) {
  args = Array.prototype.slice.call(args, 0);

  var callback = args.pop();
  var names = callback.toString().match(/^function \(([^\)]*)\)/)[1];
  var code = eval('(function (' + names + ') {callback.apply(this, arguments); return queue.process();})');

  return method.apply(this, args.concat(code));
}

module.exports = tinto;
