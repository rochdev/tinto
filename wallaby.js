'use strict';

module.exports = function() {
  return {
    files: [
      'lib/**/*.js',
      {pattern: 'test/mocks/**/*.js', instrument: false}
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
