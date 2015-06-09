'use strict';

var Q = require('q');
var chalk = require('chalk');
var queue = require('../queue');

function pause() {
  queue.push(function() {
    var deferred = Q.defer();

    console.log(chalk.yellow('    Tinto is paused. Press any key to continue...'));

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.resume();
    process.stdin.on('data', function() {
      process.stdin.pause();
      deferred.resolve();
    });

    return deferred.promise;
  });
}

module.exports = pause;
