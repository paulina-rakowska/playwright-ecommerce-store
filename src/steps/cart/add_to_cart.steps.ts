import { When, Then, Given } from "@cucumber/cucumber";
import test, { expect, Locator } from "@playwright/test";
import { CustomWorld} from "../../support/world";
import ProductsPage from "../../pages/ProductsPage";
import { baseUrl, inventoryUrl, productDetailsUrl } from "../../utils/env";
import ProductDetailsPage from "../../pages/ProductDetailsPage";
import { mockProductData } from "../../../mocks/products";

let selectedProduct: Locator, selectedProductButton: Locator, productData: { id: number, productName: string, description: string, price: number, imageUrl: string } [];

// Helper function to get testContext safely
function getTestContext(world: CustomWorld) {
    if (!world.testContext) {
        throw new Error('Test context not initialized');
    }
    return world.testContext;
}


Given("First product is visible", async function (this: CustomWorld) {
    const { testedPage, testedUrl, initialCartCount } = getTestContext(this);
    if(testedPage instanceof ProductsPage) {
        selectedProduct = await testedPage.getProductByIndex(0);
        expect(selectedProduct).toBeVisible();
    }
    else {
        throw new Error("'This operation is only available on ProductsPage'");
    }
});

//ProductDetailsPage
Given("The product API returns the standard set of mock products", async function (this: CustomWorld) {
    const { testedPage, testedUrl, initialCartCount } = getTestContext(this);
    await this.page!.route('**/api/v1/products', async (route) => {
        productData = structuredClone(mockProductData);

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(productData),
        });
    });

    this.page!.on('response', async (response: { url: () => string | string[]; }) => {
        if (response.url().includes('/api/v1/products')) {
            console.log(">>> Mocked product API received by browser! Before");
            console.log(productData);
        }
    });
});
Given('Add to cart button is visible', async function (this: CustomWorld) {
    const { testedPage, testedUrl, initialCartCount } = getTestContext(this);
    if(testedPage instanceof ProductDetailsPage){
        selectedProductButton = testedPage.getButton();
        await expect(selectedProductButton).toBeVisible();
    }
    else {
        throw new Error('This operation is only available on ProductDetailsPage');
    }
});

//ProductsPage
When("I click first product button Add to cart", async function (this: CustomWorld) {
    const { testedPage, testedUrl, initialCartCount } = getTestContext(this);
    if(testedPage instanceof ProductsPage) selectedProductButton = await testedPage.addProductToCart(selectedProduct);
    else throw new Error('This operation is only available on ProductsPage');
});
//ProductDetailsPage
When('I click product button Add to cart', async function () {
    await selectedProductButton.click();
});

//ProductsPage + ProductDetailsPage
Then('text on the button should change to Remove', async function (this: CustomWorld) {
    await expect(selectedProductButton).toHaveText("Remove");
});

Then("cart badge should be incremented by one", async function (this: CustomWorld) {
    let newCount: number;
    const { testedPage, testedUrl, initialCartCount } = getTestContext(this);
    if (testedPage) {
        newCount = await testedPage.getCartBadgeCount();
    } else {
        throw new Error("testedPage is not initialized. Make sure you navigated to a page first.");
    }
    expect(newCount).toBe(initialCartCount + 1);
});
