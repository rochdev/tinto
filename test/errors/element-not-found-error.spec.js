'use strict';

var expect = require('chai').expect;

describe('', function() {
  var ElementNotFoundError;

  beforeEach(function() {
    ElementNotFoundError = require('../../lib/errors/element-not-found-error');
  });

  it('should have the right name', function() {
    var error = new ElementNotFoundError();

    expect(error).to.have.property('name', 'ElementNotFoundError');
  });

  it('should have the right error message', function() {
    var error = new ElementNotFoundError();

    expect(error).to.have.property('message', 'Element could not be found');
  });
});
