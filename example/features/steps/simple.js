'use strict';

var tinto = require('../../../lib/tinto');
var TodoApp = require('../../components/todo-app');

module.exports = tinto(function() {
  var todoApp;

  this.Given(/^I visit TODOMVC$/, function() {
    tinto.open('http://todomvc.com/examples/backbone/');

    todoApp = TodoApp.from(tinto.evaluator.find('#todoapp'));
  });

  this.When(/^I enter \"([^\"]*)\"$/, function(value) {
    todoApp.newTodo.enter(value);
    todoApp.newTodo.enter(tinto.key.ENTER);
  });

  this.Then(/^I should see \"([^\"]*)\"$/, function(expected) {
    todoApp.todos.at(1).should.eventually.have.text(expected);
  });
});
