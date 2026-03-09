import { test, expect, Locator } from "@playwright/test";
import { baseUrl, inventoryUrl, productDetailsUrl } from "../src/utils/env";
import { stubProductData } from "../stubs/products";
import ProductsPage from "../src/pages/ProductsPage";

test.describe("Checkout tests", () => {
    test.describe("checkout end-to-end test with 1 product", () => {
        let testedPage: ProductsPage;
        let initialCartCount: number;

        test.beforeEach(async ({ page }) => {
            testedPage = new ProductsPage(page);
            await testedPage.gotoTheStore(inventoryUrl);
            initialCartCount = await testedPage.getCartBadgeCount();
            await testedPage.clearCart(); // Clear cart first
        });
        test("add first product to cart", async ({ page }) => {
            let firstProduct: Locator;
            let firstProductButton: Locator;

            await test.step(`Get first product`, async () => {
                firstProduct = await testedPage.getProductByIndex(0);
                expect(firstProduct).toBeVisible();
            });
            await test.step(`Add first product to cart`, async () => {
                firstProductButton =
                    await testedPage.addProductToCart(firstProduct);
                await expect(firstProductButton).toHaveText("Remove");
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
                let newCount = await testedPage.getCartBadgeCount();
                expect(newCount).toBe(initialCartCount + 1);
            });
            //await page.pause();
        });
        test("add random product to cart", async ({ page }) => {
            let randomNumber: number;
            let productsCount: number;
            let randomProduct: Locator;
            let randomProductButton: Locator;

            await test.step(`Get random product`, async () => {
                productsCount = await testedPage.getProductsCount();
                console.log("productsCount");
                console.log(productsCount);
                randomNumber = Math.floor(Math.random() * productsCount);
                //randomNumber = Math.floor(Math.random() * (productsCount - 1)) + 1   //skip first product
                randomProduct =
                    await testedPage.getProductByIndex(randomNumber);
                console.log("random number");
                console.log(randomNumber);
                await expect(randomProduct).toBeVisible();
            });
            await test.step(`Add random product to cart`, async () => {
                randomProductButton =
                    await testedPage.addProductToCart(randomProduct);
                await expect(randomProductButton).toHaveText("Remove");
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
                let newCount = await testedPage.getCartBadgeCount();
                expect(newCount).toBe(initialCartCount + 1);
            });
            //await page.pause();
        });
    });
});
