import { test, expect } from '@playwright/test';
import { inventoryUrl } from '../src/utils/env';
import ProductsPage from '../src/pages/ProductsPage';

test.describe('add to cart scenarios', () => {
    let testedPage: ProductsPage;

    test.beforeEach(async ({ page }) => {
        const productsPage = new ProductsPage(page);
        productsPage.gotoTheStore(inventoryUrl);
        testedPage = productsPage;
    });

    test('add first product to cart on inventory page', async ({ page }) => {
        testedPage.addFirstProductToCart();
    });


});