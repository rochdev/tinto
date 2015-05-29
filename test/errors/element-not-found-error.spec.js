'use strict';

var expect = require('chai').expect;

describe('', function() {
  var ElementNotFoundError;
  var locator;

  beforeEach(function() {
    ElementNotFoundError = require('../../lib/errors/element-not-found-error');
    locator = {
      parent: {
        toString: function() {
          return 'parent';
        }
      },
      selector: '#test'
    };
  });

  it('should have the right name', function() {
    var error = new ElementNotFoundError(locator);

    expect(error).to.have.property('name', 'ElementNotFoundError');
  });

  it('should have the right error message', function() {
    locator.index = 1;

    var error = new ElementNotFoundError(locator);

    expect(error).to.have.property('message',
      'No element matching selector "#test" could be found under parent at index 1');
  });

  it('should have default index of 0', function() {
    var error = new ElementNotFoundError(locator);

    expect(error).to.have.property('message',
      'No element matching selector "#test" could be found under parent at index 0');
  });
});
