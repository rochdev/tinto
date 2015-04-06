'use strict';

module.exports = function(value) {
  return this.attr('value').then(function(result) {
    return value === result;
  });
};
