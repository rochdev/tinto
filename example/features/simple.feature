Feature: Simple Feature

  Background:
    Given I visit TODOMVC

  Scenario: Entering Information
    When I enter "Try Tinto"
    Then I should see "Try Tinto"
