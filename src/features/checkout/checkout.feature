@loggedin

Feature: Checkout functionality

Background:
    Given I am on the products page
    And There is at least one product in the cart

    Scenario: Checkout with one item end-to-end
        When I click the cart icon
        Then I should see the cart page 
        Then cart item should be visible in cart list with name, description and price
        Then I should see two buttons to checkout or continue shopping