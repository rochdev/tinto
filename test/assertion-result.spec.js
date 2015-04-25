'use strict';

var expect = require('chai').expect;
var AssertionResult = require('../lib/assertion-result');

describe('Assertion Result', function() {
  it('should be initialized properly', function() {
    var result = new AssertionResult(true, 'actual');

    expect(result).to.have.property('outcome', true);
    expect(result).to.have.property('actual', 'actual');
  });
});
