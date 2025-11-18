import { test, expect } from "@playwright/test";
import { baseUrl, inventoryUrl } from "../src/utils/env";
import ProductsPage from "../src/pages/ProductsPage";

test.describe('Store tests', () => {
    // test('adding product to the cart', async ({ page }) => {
    //     await page.goto(inventoryUrl);      // starts logged in via storageState
    //     const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    //     await addToCartButton.click();
    //     expect(page.locator('[data-test="shopping-cart-link"]').textContent()).toBe('1');
    //     expect(addToCartButton.textContent()).toBe('Remove');
    // });
    test('check if products are available on the inventory page', async ({ page }) => {
        const productPage = new ProductsPage(page);
        await productPage.gotoTheStore(inventoryUrl); 
        const productsCount = await productPage.checkProductsCount();
        expect(productsCount).toBeGreaterThan(0);
    });


});