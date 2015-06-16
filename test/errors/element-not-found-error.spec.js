'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;

describe('', function() {
  var ElementNotFoundError;
  var locator;

  beforeEach(function() {
    ElementNotFoundError = require('../../lib/errors/element-not-found-error');
    locator = {
      getMessage: sinon.stub().returns('test')
    };
  });

  it('should have the right name', function() {
    var error = new ElementNotFoundError(locator);

    expect(error).to.have.property('name', 'ElementNotFoundError');
  });

  it('should have the right error message', function() {
    var error = new ElementNotFoundError(locator);

    expect(error).to.have.property('message', 'test could not be found');
  });
});
