@no-auth
Feature: Login functionality

  Scenario: Login as a standard user
    When I log in as a standard user
    Then I should be redirected to the inventory page