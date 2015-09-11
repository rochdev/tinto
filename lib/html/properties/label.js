'use strict';

/* global document:false */

/**
 * @memberOf tinto.html.properties
 * @this tinto.Component
 * @returns {Promise}
 */
function label() {
  var self = this;

  return this.execute(function() {
    var id = this.getAttribute('id');
    var label = document.querySelector('label[for="' + id + '"]') || closestLabel(this);

    return label ? label.textContent.trim() : null;
  }).then(function(text) {
    if (text === null) {
      throw new Error(self.toString() + ' does not have a label');
    }

    return text;
  });
}

function closestLabel(el) {
  while (el) {
    if (el.tagName === 'LABEL') {
      return el;
    } else {
      el = el.parentElement;
    }
  }

  return null;
}

module.exports = label;
