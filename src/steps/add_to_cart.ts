import { When, Then, Given } from "@cucumber/cucumber";
import { expect, Locator } from "@playwright/test";
import { CucumberWorld } from "../support/world";
import ProductsPage from "../pages/ProductsPage";
import { inventoryUrl, productDetailsUrl } from "../utils/env";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import { mockProductData } from "../../mocks/products";

let testedUrl, testedPage: ProductsPage | ProductDetailsPage, selectedProduct: Locator, selectedProductButton: Locator,
initialCartCount: number, productData: void | undefined;

//ProductsPage
Given("I am on the products page", async function (this: CucumberWorld) {
    testedPage = new ProductsPage(this.page!);
    testedUrl = inventoryUrl;
    await testedPage.gotoTheStore(testedUrl);
    initialCartCount = await testedPage.getCartBadgeCount();
    await testedPage.clearCart(); // Clear cart first
});

Given("First product is visible", async function (this: CucumberWorld) {
    selectedProduct = await testedPage.getProductByIndex(0);
    expect(selectedProduct).toBeVisible();
});

//ProductDetailsPage
Given("The product API returns the standard set of mock products", async function (this: CucumberWorld) {
    await this.page?.route('**/api/products', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockProductData)
        });
        console.log('*** API request mocked with custom product data! ***');
    });
    console.log("inside given product api");
});
Given("I am on the product details page", async function (this: CucumberWorld) {
    testedPage = new ProductDetailsPage(this.page!);
    testedUrl = productDetailsUrl+ "0";
    await testedPage.gotoTheStore(testedUrl);
    initialCartCount = await testedPage.getCartBadgeCount(); 
    await testedPage.clearCart(); // Clear cart first
});
Given('Add to cart button is visible', async function () {
   selectedProductButton = testedPage.getButton();
   console.log("selectedProductButton");
   console.log(selectedProductButton);
   await expect(selectedProductButton).toBeVisible();
});

//ProductsPage
When("I click first product button Add to cart", async function (this: CucumberWorld) {
    selectedProductButton = await testedPage.addProductToCart(selectedProduct);
});
//ProductDetailsPage
When('I click product button Add to cart', async function () {
    await selectedProductButton.click();
});

//ProductsPage + ProductDetailsPage
Then('text on the button should change to Remove', async function (this: CucumberWorld) {
    await expect(selectedProductButton).toHaveText("Remove");
});

Then("cart badge should be incremented by one", async function (this: CucumberWorld) {
    let newCount: number;
    if (testedPage) {
        newCount = await testedPage.getCartBadgeCount();
    } else {
        throw new Error("testedPage is not initialized. Make sure you navigated to a page first.");
    }
    expect(newCount).toBe(initialCartCount + 1);
});
