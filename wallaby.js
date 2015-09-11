'use strict';

module.exports = function () {
  return {
    files: [
      'lib/**/*.js',
      'test/mocks/**/*.js'
    ],

    tests: [
      'test/**/*.spec.js'
    ],

    env: {
      type: 'node'
    },

    testFramework: 'mocha'
  };
};
