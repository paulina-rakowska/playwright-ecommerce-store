@loggedin

Feature: Checkout functionality

Background:
    Given I am on the products page
    And First product is visible
    When I click first product button Add to cart

    Scenario: Checkout with one item end-to-end
        When I click the cart icon
        Then I should see the cart page 
        And cart item should be visible in cart list with name, description and price
        And I should see two buttons to go back and continue
        When I click Checkout button
        Then I should see the form with 3 inputs
        And the buttons placeholders should be "First Name", "Last name", "Zip/Postal Code"
        And I should be able to type in them
        And I should see two buttons to go back and continue
        When all inputs are filled
        And I click "Continue"
        Then I should be able to see payment and shipping information
        And I should see two buttons to go back and continue
        When I click "Finish"
        Then I the url should change to "https://www.saucedemo.com/checkout-complete.html"
        And I should see thanks for placing my order
