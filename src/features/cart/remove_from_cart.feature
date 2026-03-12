@loggedin

Feature: Remove product from cart functionality

    Scenario: Check if removing two products is working on products page
        Given I am on the products page
        And There are two products in the cart
        When I click product buttons with "Remove" text
        Then text on the button should change to "Add to cart"
        And cart badge should disappear as cart should be empty

    Scenario: Check if removing one product is working on product details page
        Given The product API returns a standard set of stubbed products
        And I am on the product details page
        And Clearing the cart
        And Add to cart button is visible
        When I click product button Add to cart
        Then text on the button should change to Remove
        And cart badge should be incremented by one