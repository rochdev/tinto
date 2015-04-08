'use strict';

var tinto = {};

/** @namespace */
tinto.html = {};
/** @namespace */
tinto.html.states = {};
/** @namespace */
tinto.html.properties = {};

tinto.html.states.empty = require('./states/empty');
tinto.html.properties.text = require('./properties/text');
tinto.html.properties.value = require('./properties/value');

module.exports = tinto.html;
