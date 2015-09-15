'use strict';

var load = require('../utils/load');
var tinto = {};

/** @namespace */
tinto.html = {};
/** @namespace */
tinto.html.components = load(__dirname, 'components');
/** @namespace */
tinto.html.states = load(__dirname, 'states');
/** @namespace */
tinto.html.properties = load(__dirname, 'properties');
/** @namespace */
tinto.html.helpers = load(__dirname, 'helpers');

module.exports = tinto.html;
