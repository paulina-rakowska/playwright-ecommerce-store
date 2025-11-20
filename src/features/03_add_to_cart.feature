@loggedin

Feature: Adding to cart functionality

    Scenario: Check if adding first product to the cart is working
    Given I am on the inventory page
    When I add first product to the cart
    Then cart badge should be incremented
    And text on the button which was clicked should change to "Remove"