@loggedin

Feature: Adding to cart functionality

    Scenario: Check if adding first product to the cart is working on products page
        Given I am on the products page
        And Clearing the cart
        And First product is visible
        When I click first product button Add to cart
        Then text on the button should change to Remove
        And cart badge should be incremented by one

    Scenario: Check if adding product to the cart is working on product details page
        Given The product API returns a standard set of stubbed products
        And I am on the product details page
        And Clearing the cart
        And Add to cart button is visible
        When I click product button Add to cart
        Then text on the button should change to Remove
        And cart badge should be incremented by one