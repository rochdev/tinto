'use strict';

var queue = require('../queue');
var flag = require('./flag');
var wait = require('./wait');

/**
 * @private
 * @param {string} name
 * @param {function(tinto.Component, *) : function() : Promise} callback
 * @param {string} message
 * @returns {function(*) : Promise}
 */
function assert(name, callback, message) {
  return function(values) {
    var assertion = this;
    var context = flag(this, 'object');
    var delegate = !!flag(this, 'delegate');
    var negate = !!flag(this, 'negate');

    values = Array.prototype.slice.call(arguments, 0);

    if (delegate) {
      return add;
    } else {
      add.call(this, context);
      return this;
    }

    function add(assertable) {
      var self = this;

      queue.push(function() {
        return wait.until(callback.apply(assertion, [assertable].concat(values)), negate).then(test);
      });

      function test(results) {
        [].concat(results).forEach(function(result) {
          self.assert(result.outcome, buildMessage(false), buildMessage(true), result.expected, result.actual, !negate);
        });
      }

      function buildMessage(not) {
        var parts = ['expected', assertable.toString()];

        if (not) {
          parts.push('not');
        }

        parts.push('to');
        parts.push(message.replace(/#{name}/g, name));

        return parts.join(' ');
      }
    }
  };
}

module.exports = assert;
