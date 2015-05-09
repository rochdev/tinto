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

      var eventually = flag(this, 'eventually');

      queue.push(function() {
        if (eventually) {
          return wait.until(callback.apply(null, [assertable].concat(values)), negate).then(test);
        } else {
          return callback.apply(null, [assertable].concat(values))().then(test);
        }
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

        if (eventually) {
          parts.push('eventually');
        }

        parts.push(message.replace(/#{name}/g, name));

        return parts.join(' ');
      }
    }
  };
}

module.exports = assert;
