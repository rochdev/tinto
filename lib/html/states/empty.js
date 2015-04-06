'use strict';

module.exports = function() {
  return this.attr('value').then(function(value) {
    return value.trim() === '';
  });
};
