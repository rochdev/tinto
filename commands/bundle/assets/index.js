'use strict';

/** @namespace tinto.$name$ */
module.exports = {
  /** @namespace tinto.$name$.components */
  components: tinto.load(__dirname, 'components'),

  /** @namespace tinto.$name$.properties */
  properties: tinto.load(__dirname, 'properties'),

  /** @namespace tinto.$name$.states */
  states: tinto.load(__dirname, 'states')
};
