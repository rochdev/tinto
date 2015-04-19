'use strict';

var chai = require('chai');
var queue = require('../queue');
var wait = require('./wait');

function assert(name, callback, message) {
  return function(value) {
    var self = this;
    var object = null;
    var delegate;
    var negate;
    var eventually;

    chai.use(function(chai, utils) {
      object = utils.flag(self, 'object');
      delegate = !!utils.flag(self, 'delegate');
      negate = !!utils.flag(self, 'negate');
      eventually = utils.flag(self, 'eventually');
    });

    if (delegate) {
      return add;
    } else {
      add(object);
      return self;
    }

    function add(assertable) {
      queue.push(function() {
        if (eventually) {
          return wait.until(callback(assertable, value), negate).then(test);
        } else {
          return callback(assertable, value)().then(test);
        }
      });
    }

    function test(result) {
      self.assert(result[0], buildMessage(false), buildMessage(true), value, result[1], !negate);
    }

    function buildMessage(not) {
      var parts = ['expected #{this}'];

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
  };
}

module.exports = assert;
