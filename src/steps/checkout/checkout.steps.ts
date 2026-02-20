import { When, Then, Given } from "@cucumber/cucumber";
import test, { expect, Locator } from "@playwright/test";
import { CustomWorld } from "../../support/world";
import CheckoutPage from "../../pages/CheckoutPage";
import { inventoryUrl, checkoutUrl } from "../../utils/env";
import { stubProductData } from "../../../stubs/products";
import ProductsPage from "../../pages/ProductsPage";

// Helper function to get testContext safely
function getTestContext(world: CustomWorld) {
    if (!world.testContext) {
        throw new Error("Test context not initialized");
    }
    return world.testContext;
}

Given(
    "There is at least one product in the cart",
    async function (this: CustomWorld) {
        console.log("There is at least one product in the cart");
        const { testedPage, initialCartCount } = getTestContext(this);
        const productsPage = testedPage as ProductsPage;
        let productToBeAdded;
        if (initialCartCount === 0) {
            console.log("nothing is added to the cart");
            let productsCount = await productsPage.getProductsCount();
            let productIndex =
                productsCount > 0
                    ? Math.floor(Math.random() * productsCount)
                    : 0;
            console.log("productIndex " + productIndex);
            productToBeAdded =
                await productsPage.getProductByIndex(productIndex);
            await productsPage.addProductToCart(productToBeAdded);
        }
        const newCount =
            initialCartCount > 0
                ? initialCartCount
                : await productsPage.getCartBadgeCount();
        expect(newCount).toBeGreaterThan(0);
    }
);
When("I click the cart icon", async function (this: CustomWorld) {
    console.log("I am on Checkout step");
    const checkoutPage = new CheckoutPage(this.page!);
    await checkoutPage.cartIcon.click();
    this.testContext = {
        ...this.testContext,
        testedPage: checkoutPage
    };
});
Then("I should see the cart page", async function (this: CustomWorld) {
    await expect(this.page!).toHaveURL(checkoutUrl);
});
Then(
    "cart item should be visible in cart list with name, description and price",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        const names = await testedPage.getCartItemsNames();
        const descriptions = await testedPage.getCartItemsDescs();
        const prices = await testedPage.getCartItemsPrices();
        console.log("names ");
        console.log(names);
        console.log("descriptions ");
        console.log(descriptions);
        console.log("prices ");
        console.log(prices);

        //if there is at least one product- arrays should contain at least one string
        expect(names.length).toBeGreaterThan(0);
        expect(descriptions.length).toBeGreaterThan(0);
        expect(prices.length).toBeGreaterThan(0);

        names.forEach(async (name: string) => expect(name).not.toBe(""));
        descriptions.forEach(async (description: string) =>
            expect(description).not.toBe("")
        );
        prices.forEach(async (price: string) => expect(price).not.toBe(""));
    }
);
Then(
    "I should see two buttons to checkout or continue shopping",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        const continueShopping = await testedPage.getContinueShoppingButton();
        const checkout = await testedPage.getCheckoutButton();

        await expect(continueShopping).toBeVisible();
        await expect(checkout).toBeVisible();
    }
);
