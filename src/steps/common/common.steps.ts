// src/steps/common/common.steps.ts
import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import ProductsPage from "../../pages/ProductsPage";
import { baseUrl, inventoryUrl, productDetailsUrl } from "../../utils/env";
import ProductDetailsPage from "../../pages/ProductDetailsPage";
import { mockProductData } from "../../../mocks/products";

Given("I am on the products page", async function (this: CustomWorld) {
    const testedPage = new ProductsPage(this.page!);
    const testedUrl = inventoryUrl;
    await testedPage.gotoTheStore(testedUrl);
    const initialCartCount = await testedPage.getCartBadgeCount();
    await testedPage.clearCart();
    
    // Store values in the test context
    this.testContext = {
        testedPage,
        testedUrl,
        initialCartCount
    };
});

Given("The product API returns the standard set of mock products", async function (this: CustomWorld) {
    const productData = structuredClone(mockProductData);
    await this.page!.route('**/api/v1/products', async (route) => {
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
    if (!this.testContext) {
        this.testContext = {
            productData
        };
    } else {
        this.testContext.productData = productData;
    }
});

Given("I am on the product details page", async function (this: CustomWorld) {
    await this.page!.evaluate((url: string | URL | Request) => fetch(url), `${baseUrl}/api/v1/products`);
    const testedPage = new ProductDetailsPage(this.page!);
    let testedUrl = '', initialCartCount = 0;
    let prodIds = await testedPage.getProductIds(this.testContext.productData);

    for(const prodId of prodIds){
        console.log(prodId);
        testedUrl = productDetailsUrl+ prodId.toString();
        await testedPage.gotoTheStore(testedUrl);
        initialCartCount = await testedPage.getCartBadgeCount(); 
        await testedPage.clearCart(); // Clear cart first
    }
        // Store values in the test context
    this.testContext = {
        ...this.testContext,
        testedPage,
        testedUrl,
        initialCartCount
    };
});