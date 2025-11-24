import { test, expect, Locator } from "@playwright/test";
import { inventoryUrl, productDetailsUrl } from "../src/utils/env";
import ProductsPage from "../src/pages/ProductsPage";
import ProductDetailsPage from "../src/pages/ProductDetailsPage";

test.describe("add to cart scenarios", () => {
    test.describe("add to cart on products page", () => {
        let testedPage: ProductsPage;
        let initialCartCount: number;

        test.beforeEach(async ({ page }) => {
            testedPage = new ProductsPage(page);
            await testedPage.gotoTheStore(inventoryUrl);
            initialCartCount = await testedPage.getCartBadgeCount();
            await testedPage.clearCart(); // Clear cart first
        });
        test("add first product to cart", async ({
            page
        }) => {
            let firstProduct: Locator;
            let firstProductButton: Locator;

            await test.step(`Get first product`, async () => {
                firstProduct = await testedPage.getProductByIndex(0);
                expect(firstProduct).toBeVisible();
            });
            await test.step(`Add first product to cart`, async () => {
                firstProductButton = await testedPage.addProductToCart(
                    firstProduct
                );
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
                randomProduct = await testedPage.getProductByIndex(
                    randomNumber
                );
                console.log("random number");
                console.log(randomNumber);
                await expect(randomProduct).toBeVisible();
            });
            await test.step(`Add random product to cart`, async () => {
                randomProductButton = await testedPage.addProductToCart(
                    randomProduct
                );
                await expect(randomProductButton).toHaveText("Remove");
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
                let newCount = await testedPage.getCartBadgeCount();
                expect(newCount).toBe(initialCartCount + 1);
            });
            //await page.pause();
        });

        test("add all products to cart", async ({ page }) => {
            let productsCount: number;

            await test.step(`Get all products count`, async () => {
                productsCount = await testedPage.getProductsCount();
                console.log("productsCount");
                console.log(productsCount);
            });
            await test.step(`Add all products to cart`, async () => {
                let allProductButtons = await testedPage.addAllProductsToCart();
                for (const productButton of allProductButtons) {
                    await expect(productButton).toHaveText("Remove");
                }
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
                let newCount = await testedPage.getCartBadgeCount();
                expect(newCount).toBe(initialCartCount + productsCount);
            });
            //await page.pause();
        });
    });


    test.describe("add to cart on product details page", () => {
        let testedPage: ProductDetailsPage;
        let initialCartCount: number;
        let selectedProductButton: Locator;

        test.beforeEach(async ({ page }) => {
            testedPage = new ProductDetailsPage(page);
            await testedPage.gotoTheStore(productDetailsUrl+"0");
            initialCartCount = await testedPage.getCartBadgeCount();
            await testedPage.clearCart(); // Clear cart first
        });

        test("add product from details page", async ({ page }) => {
            await test.step(`Add to cart button is visible`, async () => {
                selectedProductButton = testedPage.getButton();
                console.log("selectedProductButton");
                console.log(selectedProductButton);
                await expect(selectedProductButton).toBeVisible();
            });
            await test.step(`I click product button Add to cart`, async () => {
                await selectedProductButton.click();
                await expect(selectedProductButton).toHaveText("Remove");
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
                let newCount = await testedPage.getCartBadgeCount();
                expect(newCount).toBe(initialCartCount + 1);
            });
        });
    });
});
