'use strict';

/**
 * @constructor
 * @extends Error
 */
function ElementNotFoundError(locator) {
  this.name = 'ElementNotFoundError';
  this.message = 'No element matching selector "' + locator.selector + '" could be found under ' +
    locator.parent + ' at index ' + (locator.index || 0);
}

ElementNotFoundError.prototype = Object.create(Error.prototype);
ElementNotFoundError.constructor = ElementNotFoundError;

module.exports = ElementNotFoundError;
