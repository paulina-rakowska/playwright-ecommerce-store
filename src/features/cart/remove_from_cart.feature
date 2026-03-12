@loggedin

Feature: Remove product from cart functionality

    Scenario: Check if removing two products is working on products page
        Given I am on the products page
        And There are two products in the cart
        When I click product buttons with "Remove" text
        Then text on the button should change to "Add to cart"
        And cart badge should be decremented by one

    Scenario: Check if removing one product is working on product details page
        Given The product API returns a standard set of stubbed products
        And I am on the product details page
        And There is one product in the cart
        When I click product button with "Remove" text
        Then text on the button should change to "Add to cart"
        And cart badge should disappear and cart should be empty