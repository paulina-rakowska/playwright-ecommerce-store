// src/steps/common/common.steps.ts
import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import ProductsPage from "../../pages/ProductsPage";
import { baseUrl, inventoryUrl, productDetailsUrl } from "../../utils/env";
import ProductDetailsPage from "../../pages/ProductDetailsPage";
import { stubProductData } from "../../../stubs/products";

Given("I am on the products page", async function (this: CustomWorld) {
    const testedPage = new ProductsPage(this.page!);
    const testedUrl = inventoryUrl;
    await testedPage.gotoTheStore(testedUrl);
    const initialCartCount = await testedPage.getCartBadgeCount();
    console.log("common step");
    console.log("I am on the products page");
    console.log(initialCartCount);
    // Store values in the test context
    this.testContext = {
        testedPage,
        testedUrl,
        initialCartCount
    };
});
Given("Clearing the cart", async function (this: CustomWorld) {
    await this.testContext.testedPage.clearCart();
});
Given(
    "The product API returns a standard set of stubbed products",
    async function (this: CustomWorld) {
        const productData = structuredClone(stubProductData);

        await this.page!.route("**/api/v1/products", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify(productData)
            });
        });
        // Debug listener: logs the stubbed product API response when received by the browser.
        this.page!.on("response", async (response) => {
            if (response.url().includes("/api/v1/products")) {
                console.log(">>> Stubbed product API response received");
                console.log(productData);
            }
        });
        this.testContext ??= {};
        this.testContext.productData = productData;
    }
);

Given("I am on the product details page", async function (this: CustomWorld) {
    await this.page!.evaluate(
        (url: string | URL | Request) => fetch(url),
        `${baseUrl}/api/v1/products`
    );
    const testedPage = new ProductDetailsPage(this.page!);
    let testedUrl = "",
        initialCartCount = 0;
    let prodIds = await testedPage.getProductIds(this.testContext.productData);

    for (const prodId of prodIds) {
        console.log(prodId);
        testedUrl = productDetailsUrl + prodId.toString();
        await testedPage.gotoTheStore(testedUrl);
        initialCartCount = await testedPage.getCartBadgeCount();
    }
    // Store values in the test context
    this.testContext = {
        ...this.testContext,
        testedPage,
        testedUrl,
        initialCartCount
    };
});
