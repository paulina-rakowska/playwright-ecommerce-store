import { test, expect, Locator } from "@playwright/test";
import {
    baseUrl,
    inventoryUrl,
    cartUrl,
    checkoutStepOneUrl,
    checkoutStepTwoUrl,
    checkoutCompleteUrl,
    productDetailsUrl
} from "../src/utils/env";
import { stubProductData } from "../stubs/products";
import ProductsPage from "../src/pages/ProductsPage";
import CartPage from "../src/pages/CartPage";
import CheckoutStepOnePage from "../src/pages/CheckoutStepOnePage";
import CheckoutStepTwoPage from "../src/pages/CheckoutStepTwoPage";
import CheckoutCompletePage from "../src/pages/CheckoutCompletePage";

function validateListNotEmpty(items: string[], fieldName: string) {
    // Sprawdzamy, czy w ogóle są jakieś elementy w koszyku
    expect(
        items.length,
        `List of ${fieldName} should not be empty`
    ).toBeGreaterThan(0);
    for (const item of items) {
        expect(
            item,
            `${fieldName} value should not be an empty string`
        ).not.toBe("");
    }
}
async function extractPrice(
    element: Locator
): Promise<{ elementCount: number; elementText: string }> {
    const elementCount = await element.count();
    const subTotal = await element.innerText();
    const elementText = subTotal.match(/\d+\.?\d*/)?.[0] ?? "";
    return { elementCount, elementText };
}
test.describe("Checkout tests", () => {
    test("checkout end-to-end test with 1 product", async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const stepOnePage = new CheckoutStepOnePage(page);
        const stepTwoPage = new CheckoutStepTwoPage(page);
        const completePage = new CheckoutCompletePage(page);

        let initialCartCount: number;

        // --- Background ---
        await test.step("Background: Prepare cart with at least one product", async () => {
            await productsPage.gotoTheStore(inventoryUrl);
            initialCartCount = await productsPage.getCartBadgeCount();
            if (initialCartCount === 0) {
                const productsCount = await productsPage.getProductsCount();
                const randomNumber = Math.floor(Math.random() * productsCount);
                const randomProduct =
                    await productsPage.getProductByIndex(randomNumber);
                await productsPage.addProductToCart(randomProduct);
            }
        });

        // --- Cart Step ---
        await test.step("I proceed to the cart and verify its content", async () => {
            await cartPage.cartIcon.click();
            await expect(page).toHaveURL(cartUrl);
            const names = await cartPage.getCartItemsNames();
            const descriptions = await cartPage.getCartItemsDescs();
            const prices = await cartPage.getCartItemsPrices();

            validateListNotEmpty(names, "names");
            validateListNotEmpty(descriptions, "descriptions");
            validateListNotEmpty(prices, "prices");

            const continueShopping = cartPage.continueShoppingButton;
            const checkout = cartPage.checkoutButton;

            await expect(continueShopping).toBeVisible();
            await expect(checkout).toBeVisible();
        });

        // --- Step 1: Shipping Information
        await test.step("I fill in the shipping information", async () => {
            await cartPage.checkoutButton.click();
            await expect(page).toHaveURL(checkoutStepOneUrl);
            await expect(stepOnePage.checkoutInputs).toHaveCount(3);
            await expect(stepOnePage.checkoutInputs.nth(0)).toBeVisible();
            await expect(stepOnePage.checkoutInputs.nth(1)).toBeVisible();
            await expect(stepOnePage.checkoutInputs.nth(2)).toBeVisible();

            await stepOnePage.checkoutInputs.nth(0).fill("Andrew");
            await stepOnePage.checkoutInputs.nth(1).fill("Tate");
            await stepOnePage.checkoutInputs.nth(2).fill("34-231");

            await expect(stepOnePage.cancelButton).toBeVisible();
            await expect(stepOnePage.continueButton).toBeVisible();
            await stepOnePage.continueButton.click();
        });

        // --- Step 2: Overview
        await test.step("I verify order summary", async () => {
            await page.waitForURL(checkoutStepTwoUrl);
            const names = await stepTwoPage.getCartItemsNames();
            const descriptions = await stepTwoPage.getCartItemsDescs();
            const prices = await stepTwoPage.getCartItemsPrices();

            validateListNotEmpty(names, "names");
            validateListNotEmpty(descriptions, "descriptions");
            validateListNotEmpty(prices, "prices");

            const paymentInformationCount =
                await stepTwoPage.paymentInformation.count();
            const shippingInformationCount =
                await stepTwoPage.shippingInformation.count();
            const { elementCount: itemTotalCount, elementText: itemTotal } =
                await extractPrice(stepTwoPage.itemTotal);
            const { elementCount: taxCount, elementText: tax } =
                await extractPrice(stepTwoPage.tax);
            const { elementCount: totalCount, elementText: total } =
                await extractPrice(stepTwoPage.priceTotal);

            expect(shippingInformationCount).toBe(1);
            expect(stepTwoPage.shippingInformation).not.toBe("");
            expect(paymentInformationCount).toBe(1);
            expect(stepTwoPage.paymentInformation).not.toBe("");
            expect(itemTotalCount).toBe(1);
            expect(itemTotal).not.toBe("");
            expect(taxCount).toBe(1);
            expect(tax).not.toBe("");
            expect(totalCount).toBe(1);
            expect(total).not.toBe("");

            await stepTwoPage.finishButton.click();
            await page.waitForLoadState("domcontentloaded");
        });

        // --- Complete
        await test.step("I should see the order confirmation", async () => {
            await expect(page).toHaveURL(checkoutCompleteUrl);
            await expect(completePage.completeHeader).toHaveText(
                "Thank you for your order!"
            );
            await expect(completePage.completeText).toHaveText(
                "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
            );
            await expect(completePage.backHomeButton).toBeVisible();
        });
    });
});
