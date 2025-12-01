import { test, expect } from "@playwright/test";
import { inventoryUrl } from "../src/utils/env";
import ProductsPage from "../src/pages/ProductsPage";

test.describe('Listing tests', () => {

    test('check if products are available on the inventory page', async ({ page}) => {
        let productsPage = new ProductsPage(page);
        await productsPage.gotoTheStore(inventoryUrl);;
        const productsCount = await productsPage.getProductsCount();
        expect(productsCount).toBeGreaterThan(0);
    });


});