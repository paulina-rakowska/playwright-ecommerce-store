import { test, expect, Locator } from "@playwright/test";
import { baseUrl, inventoryUrl, productDetailsUrl } from "../src/utils/env";
import { stubProductData } from "../stubs/products";
import ProductsPage from "../src/pages/ProductsPage";
import ProductDetailsPage from "../src/pages/ProductDetailsPage";

test.describe("Add to cart tests", () => {
    test.describe("add to cart on products page", () => {
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

        test("add all products to cart", async ({ page }) => {
            let productsCount: number;

            await test.step(`Get all products count`, async () => {
                productsCount = await testedPage.getProductsCount();
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
        let productData: {
            id: number;
            productName: string;
            description: string;
            price: number;
            imageUrl: string;
        }[];

        test.beforeEach(async ({ page }) => {
            await page.route("**/api/v1/products", async (route) => {
                productData = structuredClone(stubProductData);

                await route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify(productData)
                });
            });

            page.on("response", async (response) => {
                if (response.url().includes("/api/v1/products")) {
                    console.log(
                        ">>> Mocked product API received by browser! Before"
                    );
                    console.log(productData);
                }
            });
        });

        test("add product from details page", async ({ page }) => {
            await test.step(`Visit all product details pages`, async () => {
                await page!.evaluate(
                    (url) => fetch(url),
                    `${baseUrl}/api/v1/products`
                );
                testedPage = new ProductDetailsPage(page);
                let prodIds = await testedPage.getProductIds(productData);
                for (const prodId of prodIds) {
                    await testedPage.gotoTheStore(
                        productDetailsUrl + prodId.toString()
                    );
                    initialCartCount = await testedPage.getCartBadgeCount();
                    await testedPage.clearCart(); // Clear cart first
                    await expect(testedPage.productButton).toBeVisible();
                }
            });
            await test.step(`I click product button Add to cart`, async () => {
                await testedPage.productButton.click();
                await expect(testedPage.productButton).toHaveText("Remove");
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
                let newCount = await testedPage.getCartBadgeCount();
                expect(newCount).toBe(initialCartCount + 1);
            });
        });
    });
});
