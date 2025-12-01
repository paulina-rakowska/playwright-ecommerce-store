@notloggedin

Feature: Login functionality

  Scenario: Login as a standard user should be success
    When I log in as a standard user
    Then I should be redirected to the inventory page