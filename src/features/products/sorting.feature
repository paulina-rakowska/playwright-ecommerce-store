@loggedin

Feature: Sorting products functionality

    Scenario: Check if Sorting AZ is working 
        Given I am on the products page
        When I click "Name (A to Z)" option in product sort select
        Then product names should be sorted in order "A-Z"
    Scenario: Check if Sorting ZA is working 
        Given I am on the products page
        When I click "Name (Z to A)" option in product sort select
        Then product names should be sorted in order "Z-A"
    Scenario: Check if Sorting low to high is working 
        Given I am on the products page
        When I click "Price (low to high)" option in product sort select
        Then product prices should be sorted in order "low-high"
    Scenario: Check if Sorting high to low is working 
        Given I am on the products page
        When I click "Price (high to low)" option in product sort select
        Then product prices should be sorted in order "high-low"