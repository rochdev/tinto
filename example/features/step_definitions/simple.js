'use strict';

var tinto = require('../../../index');
var TodoApp = require('../../components/todo-app');

module.exports = tinto(function() {
  var todoApp;

  this.Given(/^I visit TODOMVC$/, function() {
    tinto.browser.open('http://todomvc.com/examples/backbone/');

    todoApp = TodoApp.from(tinto.page.find('.todoapp').first());
  });

  this.When(/^I enter "([^"]*)"$/, function(value) {
    todoApp.newTodo.enter(value, tinto.keyboard.ENTER);
  });

  this.Then(/^I should see "([^"]*)"$/, function(expected) {
    todoApp.todos(0).should.have.text(expected);
  });
});
