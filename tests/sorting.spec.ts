import { test, expect } from "@playwright/test";
import { inventoryUrl } from "../src/utils/env";
import ProductsPage from "../src/pages/ProductsPage";

test.describe('Sorting tests', () => {
    let testedPage: ProductsPage;
    // Map sort option names to sort values
    const sortMap: Record<string, string> = {
        'Name (A to Z)': 'az',
        'Name (Z to A)': 'za',
        'Price (low to high)': 'lohi',
        'Price (high to low)': 'hilo'
    };

    test.beforeEach(async ({ page }) => {
        testedPage = new ProductsPage(page);
        await testedPage.gotoTheStore(inventoryUrl);
    });
    test('check if Sorting AZ is working ', async ({ page}) => {
        await testedPage.clickSort('az');
        const productNames = await testedPage.getProductNames();
        let sortedNames = await testedPage.sortProducts(productNames, 'A-Z');
        console.log("Order", 'A-Z');
        console.log("Actual product names from page:", productNames);
        console.log("Expected sorted:", sortedNames);
        
        expect(productNames).toEqual(sortedNames);
    });
    test('check if Sorting ZA is working ', async ({ page}) => {
        await testedPage.clickSort('za');
        const productNames = await testedPage.getProductNames();
        let sortedNames = await testedPage.sortProducts(productNames, 'Z-A');
        console.log("Order", 'Z-A');
        console.log("Actual product names from page:", productNames);
        console.log("Expected sorted:", sortedNames);
        
        expect(productNames).toEqual(sortedNames);
    });
    test('Check if Sorting low to high is working', async ({ page}) => {
        await testedPage.clickSort('lohi');
        const productPrices = await testedPage.getProductPrices();
        let sortedPrices = await testedPage.sortProducts(productPrices, 'low-high');
        console.log("Order", 'low-high');
        console.log("Actual product names from page:", productPrices);
        console.log("Expected sorted:", sortedPrices);

        expect(productPrices).toEqual(sortedPrices);
    });
    test('Check if Sorting high to low is working', async ({ page}) => {
        await testedPage.clickSort('hilo');
        const productPrices = await testedPage.getProductPrices();
        let sortedPrices = await testedPage.sortProducts(productPrices, 'high-low');
        console.log("Order", 'high-low');
        console.log("Actual product names from page:", productPrices);
        console.log("Expected sorted:", sortedPrices);

        expect(productPrices).toEqual(sortedPrices);
    });
});