import { test, expect, Locator } from '@playwright/test';
import { inventoryUrl } from '../src/utils/env';
import ProductsPage from '../src/pages/ProductsPage';
import ProductDetailsPage from '../src/pages/ProductDetailsPage';

test.describe('add to cart scenarios', () => {

    test.describe('add to cart on inventory page', () => {
        let testedPage: ProductsPage;
        let cartBadgeElement: Locator;
        let cartBadgeCount: number;

        test.beforeEach(async ({ page }) => {
            const productsPage = new ProductsPage(page);
            productsPage.gotoTheStore(inventoryUrl);
            cartBadgeElement =  page.locator('[data-test="shopping-cart-link"]');
            cartBadgeCount = parseInt((await cartBadgeElement.textContent()) || '0');
            testedPage = productsPage;
        });
        test('add first product to cart on inventory page', async ({ page }) => {
            let firstProduct: Locator;
            let firstProductButton: Locator;

            await test.step(`Get first product`, async () => {
                firstProduct = await testedPage.getProductByIndex(1);
                expect(firstProduct).toBeVisible();
            });
            await test.step(`Add first product to cart`, async () => {
                firstProductButton = await testedPage.addProductToCart(firstProduct);
                await expect(firstProductButton).toHaveText('Remove');
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
                let newCount = parseInt((await cartBadgeElement.textContent()) || '0'); 
                expect(newCount).toEqual(cartBadgeCount + 1);
            });
            await page.pause();
        });
        test('add random product to cart', async ({ page }) => {
            let randomNumber: number;
            let productsCount: number;
            let randomProduct: Locator;
            let randomProductButton: Locator;
            
            await test.step(`Get all products count`, async () => {
                productsCount = await testedPage.getProductsCount();
                console.log("productsCount");
                console.log(productsCount);
            });

            await test.step(`Get random product`, async () => {
                randomNumber = Math.floor(Math.random() * productsCount);
                randomProduct = await testedPage.getProductByIndex(randomNumber);
                console.log("random number");
                console.log(randomNumber);
                await expect(randomProduct).toBeVisible();
            });
            await test.step(`Add random product to cart`, async () => {
                randomProductButton = await testedPage.addProductToCart(randomProduct);
                await expect(randomProductButton).toHaveText('Remove');
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
                let newCount = parseInt((await cartBadgeElement.textContent()) || '0'); 
                expect(newCount).toEqual(cartBadgeCount + 1);
            });
            await page.pause();
        });

        test('add all products to cart', async ({ page }) => {
            // Your test logic here
        });
    });
    test.describe('add to cart on product details page', () => {
        let productDetailsPage: ProductDetailsPage;
        let cartBadgeElement: Locator;
        let cartBadgeCount: number;

        test.beforeEach(async ({ page }) => {
            // productDetailsPage = new ProductDetailsPage(page);
            // await productDetailsPage.goto(productDetailsUrl);
            // cartBadgeElement = page.locator('[data-test="shopping-cart-link"]');
            // cartBadgeCount = parseInt((await cartBadgeElement.textContent()) || '0');
        });

        test('add product from details page', async ({ page }) => {
            // Your test logic here
        });
    });
});