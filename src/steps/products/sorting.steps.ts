import { When, Then} from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../support/world";

// Helper function to get testContext safely
function getTestContext(world: CustomWorld) {
    if (!world.testContext) {
        throw new Error('Test context not initialized');
    }
    return world.testContext;
}

// Map sort option names to sort values
const sortMap: Record<string, string> = {
    'Name (A to Z)': 'az',
    'Name (Z to A)': 'za',
    'Price (low to high)': 'lohi',
    'Price (high to low)': 'hilo'
};

When('I click {string} option in product sort select', async function (this: CustomWorld, sortOption: string) {
    const { testedPage } = getTestContext(this);
    const sortValue = sortMap[sortOption];
    
    if (!sortValue) {
        throw new Error(`Unknown sort option: ${sortOption}`);
    }
    
    await testedPage.clickSort(sortValue);
});

Then("product names should be sorted in order {string}", async function (this: CustomWorld, order: string) {
    const { testedPage } = getTestContext(this);
    const productNames = await testedPage.getProductNames();
    let sortedNames = await testedPage.sortProducts(productNames, order);
    console.log("Order", order);
    console.log("Actual product names from page:", productNames);
    console.log("Expected sorted:", sortedNames);

    expect(productNames).toEqual(sortedNames);
});

Then("product prices should be sorted in order {string}", async function (this: CustomWorld, order: string) {
    const { testedPage } = getTestContext(this);
    const productPrices = await testedPage.getProductPrices();
    let sortedPrices = await testedPage.sortProducts(productPrices, order);
    console.log("Order", order);
    console.log("Actual product names from page:", productPrices);
    console.log("Expected sorted:", sortedPrices);

    expect(productPrices).toEqual(sortedPrices);
});