import { When, Then, Given } from "@cucumber/cucumber";
import test, { expect, Locator } from "@playwright/test";
import { CustomWorld } from "../../support/world";
import ProductsPage from "../../pages/ProductsPage";
import ProductDetailsPage from "../../pages/ProductDetailsPage";

let selectedProduct: Locator, selectedProductButton: Locator;

// Helper function to get testContext safely
function getTestContext(world: CustomWorld) {
    if (!world.testContext) {
        throw new Error("Test context not initialized");
    }
    return world.testContext;
}

Given("First product is visible", async function (this: CustomWorld) {
    const { testedPage, testedUrl, initialCartCount } = getTestContext(this);
    if (testedPage instanceof ProductsPage) {
        selectedProduct = await testedPage.getProductByIndex(0);
        expect(selectedProduct).toBeVisible();
    } else {
        throw new Error("'This operation is only available on ProductsPage'");
    }
});

//ProductDetailsPage
Given("Add to cart button is visible", async function (this: CustomWorld) {
    const { testedPage, testedUrl, initialCartCount } = getTestContext(this);
    if (testedPage instanceof ProductDetailsPage) {
        selectedProductButton = testedPage.productButton;
        await expect(selectedProductButton).toBeVisible();
    } else {
        throw new Error(
            "This operation is only available on ProductDetailsPage"
        );
    }
});

//ProductsPage
When(
    "I click first product button Add to cart",
    async function (this: CustomWorld) {
        const { testedPage, testedUrl, initialCartCount } =
            getTestContext(this);
        if (testedPage instanceof ProductsPage)
            selectedProductButton =
                await testedPage.addProductToCart(selectedProduct);
        else
            throw new Error("This operation is only available on ProductsPage");
    }
);
//ProductDetailsPage
When("I click product button Add to cart", async function () {
    await selectedProductButton.click();
});

//ProductsPage + ProductDetailsPage
Then(
    "text on the button should change to Remove",
    async function (this: CustomWorld) {
        await expect(selectedProductButton).toHaveText("Remove");
    }
);

Then(
    "cart badge should be incremented by one",
    async function (this: CustomWorld) {
        let newCount: number;
        const { testedPage, testedUrl, initialCartCount } =
            getTestContext(this);
        if (testedPage) {
            newCount = await testedPage.getCartBadgeCount();
        } else {
            throw new Error(
                "testedPage is not initialized. Make sure you navigated to a page first."
            );
        }
        expect(newCount).toBe(initialCartCount + 1);
    }
);
