'use strict';

/**
 * @constructor
 * @param {tinto.Locator} locator
 * @extends Error
 */
function ElementNotFoundError(locator) {
  this.name = 'ElementNotFoundError';
  this.message = locator.getMessage() + ' could not be found';
}

ElementNotFoundError.prototype = Object.create(Error.prototype);
ElementNotFoundError.constructor = ElementNotFoundError;

module.exports = ElementNotFoundError;
