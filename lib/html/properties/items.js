'use strict';

/**
 * @memberOf tinto.html.properties
 * @this tinto.Component
 * @returns {Promise.<string>}
 */
function items() {
  return this.find('li').map(function(item) {
    return item.getText();
  });
}

module.exports = items;
