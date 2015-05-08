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
  return function(value) {
    var context = flag(this, 'object');
    var delegate = !!flag(this, 'delegate');
    var negate = !!flag(this, 'negate');

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
          return wait.until(callback(assertable, value), negate).then(test);
        } else {
          return callback(assertable, value)().then(test);
        }
      });

      function test(result) {
        self.assert(result.outcome, buildMessage(false), buildMessage(true), value, result.actual, !negate);
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
