'use strict';

module.exports = function(value) {
  return this.text().then(function(result) {
    return value === result;
  });
};
