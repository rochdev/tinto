'use strict';

var tinto = require('../../index');

var TodoApp = tinto.Component.extend({
  get newTodo() {
    return this.find('#new-todo').at(0);
  },

  get todos() {
    return this.find('#todo-list li');
  }
});

module.exports = TodoApp;
