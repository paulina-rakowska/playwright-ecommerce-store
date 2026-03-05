@loggedin

Feature: Checkout functionality

Background:
    Given I am on the products page
    And There is at least one product in the cart

    Scenario: Checkout with one item end-to-end
        #Cart
        When I click the cart icon
        Then I should see the cart page 
        Then cart item should be visible in cart list with name, description and price
        Then I should see two buttons to checkout or continue shopping
        #Step 1
        When I click Checkout button
        Then I should see the form with 3 inputs
        And the buttons placeholders should be "First Name", "Last Name", "Zip/Postal Code"
        And I should be able to type into the input fields dummy data: "Andrew", "Tate", "34-231"
        And I should see two buttons to cancel and continue
        #Step 2
        When I click Continue
        Then on the top there should be product list with name, description and price
        Then I should be able to see payment information
        And I should be able to see shipping information
        And I should be able to see Item total price
        And I should be able to see Tax price
        And I should be able to see Price Total
        And I should see two buttons to cancel and finish
        #Complete
        When I click Finish
        Then the url should change to "https://www.saucedemo.com/checkout-complete.html"
        And I should see thanks for placing my order: "Thank you for your order!", "Your order has been dispatched, and will arrive just as fast as the pony can get there!"