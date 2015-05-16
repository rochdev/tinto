'use strict';

/**
 * @constructor
 * @extends Error
 */
function ElementNotFoundError() {
  this.name = 'ElementNotFoundError';
  this.message = 'Element could not be found';
}

ElementNotFoundError.prototype = Object.create(Error.prototype);
ElementNotFoundError.constructor = ElementNotFoundError;

module.exports = ElementNotFoundError;
