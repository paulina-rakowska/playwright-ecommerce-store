import { test, expect, Locator } from '@playwright/test';
import { inventoryUrl } from '../src/utils/env';
import ProductsPage from '../src/pages/ProductsPage';

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
                expect(firstProduct).toBeEnabled();
            });
            await test.step(`Click first product`, async () => {
                firstProductButton = await testedPage.addFirstProductToCart(firstProduct);
            });
            await test.step(`Check if cart badge count is incremented`, async () => {
            let newCount = parseInt((await cartBadgeElement.textContent()) || '0'); 
            expect(newCount).toEqual(cartBadgeCount + 1);
            });
            await test.step(`Check if button text changed to Remove`, async () => {
                await expect(firstProductButton).toHaveText('Remove');
            });
        });
    });
});