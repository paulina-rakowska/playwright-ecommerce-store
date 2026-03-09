import { When, Then, Given } from "@cucumber/cucumber";
import test, { expect, Locator } from "@playwright/test";
import { CustomWorld } from "../../support/world";
import CartPage from "../../pages/CartPage";
import CheckoutStepOnePage from "../../pages/CheckoutStepOnePage";
import CheckoutStepTwoPage from "../../pages/CheckoutStepTwoPage";
import CheckoutCompletePage from "../../pages/CheckoutCompletePage";
import {
    inventoryUrl,
    cartUrl,
    checkoutStepOneUrl,
    checkoutStepTwoUrl,
    checkoutCompleteUrl
} from "../../utils/env";
import { stubProductData } from "../../../stubs/products";
import ProductsPage from "../../pages/ProductsPage";

// Helper function to get testContext safely
function getTestContext(world: CustomWorld) {
    if (!world.testContext) {
        throw new Error("Test context not initialized");
    }
    return world.testContext;
}
async function extractPrice(
    element: Locator
): Promise<{ elementCount: number; elementText: string }> {
    const elementCount = await element.count();
    const subTotal = await element.innerText();
    const elementText = subTotal.match(/\d+\.?\d*/)?.[0] ?? "";
    return { elementCount, elementText };
}
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

Given(
    "There is at least one product in the cart",
    async function (this: CustomWorld) {
        const { testedPage, initialCartCount } = getTestContext(this);
        if (!(testedPage instanceof ProductsPage)) {
            throw new Error("Expected ProductsPage but got different page");
        }

        const productsPage = testedPage;
        let productToBeAdded;
        if (initialCartCount === 0) {
            let productsCount = await productsPage.getProductsCount();
            let productIndex =
                productsCount > 0
                    ? Math.floor(Math.random() * productsCount)
                    : 0;
            productToBeAdded =
                await productsPage.getProductByIndex(productIndex);
            await productsPage.addProductToCart(productToBeAdded);
        }
        const newCount =
            initialCartCount > 0
                ? initialCartCount
                : await productsPage.getCartBadgeCount();
        expect(newCount).toBeGreaterThan(0);
    }
);
When("I click the cart icon", async function (this: CustomWorld) {
    console.log("I am on Checkout step");
    const cartPage = new CartPage(this.page!);
    await cartPage.cartIcon.click();
    this.testContext!.testedPage = cartPage;
});
//Cart page
Then("I should see the cart page", async function (this: CustomWorld) {
    await expect(this.page!).toHaveURL(cartUrl);
});
Then(
    "cart item should be visible in cart list with name, description and price",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CartPage)) {
            throw new Error("Expected CartPage but got different page");
        }
        const cartPage = testedPage;
        const names = await cartPage.getCartItemsNames();
        const descriptions = await cartPage.getCartItemsDescs();
        const prices = await cartPage.getCartItemsPrices();

        // Używamy nowej funkcji pomocniczej
        validateListNotEmpty(names, "names");
        validateListNotEmpty(descriptions, "descriptions");
        validateListNotEmpty(prices, "prices");
    }
);
Then(
    "I should see two buttons to checkout or continue shopping",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CartPage)) {
            throw new Error("Expected CartPage but got different page");
        }
        const checkoutPage = testedPage;
        const continueShopping = checkoutPage.continueShoppingButton;
        const checkout = checkoutPage.checkoutButton;

        await expect(continueShopping).toBeVisible();
        await expect(checkout).toBeVisible();
    }
);
When("I click Checkout button", async function (this: CustomWorld) {
    const { testedPage } = getTestContext(this);
    if (!(testedPage instanceof CartPage)) {
        throw new Error("Expected CartPage but got different page");
    }
    const cartPage = testedPage;
    await cartPage.checkoutButton.click();
    await expect(this.page).toHaveURL(checkoutStepOneUrl);
});
//Step 1
Then("I should see the form with 3 inputs", async function (this: CustomWorld) {
    const checkoutPage = new CheckoutStepOnePage(this.page!);

    const inputsLength = (await checkoutPage.checkoutInputs)?.length;
    this.testContext!.testedPage = checkoutPage;
    expect(inputsLength).toBe(3);
});
Then(
    "the buttons placeholders should be {string}, {string}, {string}",
    async function (
        this: CustomWorld,
        string0: string,
        string1: string,
        string2: string
    ) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CheckoutStepOnePage)) {
            throw new Error(
                "Expected CheckoutStepOnePage but got different page"
            );
        }
        const checkoutPage = testedPage;
        const checkoutInputs = await checkoutPage.checkoutInputs;
        const expectedPlaceholders = [string0, string1, string2];

        for (const [index, expected] of expectedPlaceholders.entries()) {
            const currentPlaceholder =
                await checkoutInputs[index].getAttribute("placeholder");
            expect(currentPlaceholder).toBe(expected);
        }
    }
);
Then(
    "I should be able to type into the input fields dummy data: {string}, {string}, {string}",
    async function (
        this: CustomWorld,
        string0: string,
        string1: string,
        string2: string
    ) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CheckoutStepOnePage)) {
            throw new Error(
                "Expected CheckoutStepOnePage but got different page"
            );
        }
        const checkoutPage = testedPage;
        const checkoutInputs = await checkoutPage.checkoutInputs;
        const inputData = [string0, string1, string2];

        for (const [index, expected] of inputData.entries()) {
            await checkoutInputs[index].fill(expected);
            expect(checkoutInputs[index]).toHaveValue(expected);
        }
    }
);
Then(
    "I should see two buttons to cancel and continue",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CheckoutStepOnePage)) {
            throw new Error(
                "Expected CheckoutStepOnePage but got different page"
            );
        }
        const checkoutPage = testedPage;

        const cancelButton = checkoutPage.cancelButton;
        const continueButton = checkoutPage.continueButton;

        await expect(cancelButton).toBeVisible();
        await expect(continueButton).toBeVisible();
    }
);
When("I click Continue", async function (this: CustomWorld) {
    const { testedPage } = getTestContext(this);
    if (!(testedPage instanceof CheckoutStepOnePage)) {
        throw new Error("Expected CheckoutStepOnePage but got different page");
    }
    const checkoutPage = testedPage;
    checkoutPage.continueButton.click();
    await this.page.waitForURL(checkoutStepTwoUrl);
});
//Step 2
Then(
    "on the top there should be product list with name, description and price",
    async function (this: CustomWorld) {
        const checkoutPage = new CheckoutStepTwoPage(this.page!);
        const names = await checkoutPage.getCartItemsNames();
        const descriptions = await checkoutPage.getCartItemsDescs();
        const prices = await checkoutPage.getCartItemsPrices();
        this.testContext!.testedPage = checkoutPage;

        // Używamy nowej funkcji pomocniczej
        validateListNotEmpty(names, "names");
        validateListNotEmpty(descriptions, "descriptions");
        validateListNotEmpty(prices, "prices");
    }
);
Then(
    "I should be able to see payment information",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CheckoutStepTwoPage)) {
            throw new Error(
                "Expected CheckoutStepTwoPage but got different page"
            );
        }
        const checkoutPage = testedPage;
        const paymentInformationCount =
            await checkoutPage.paymentInformation.count();

        expect(paymentInformationCount).toBe(1);
        expect(checkoutPage.paymentInformation).not.toBe("");
    }
);
Then(
    "I should be able to see shipping information",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CheckoutStepTwoPage)) {
            throw new Error(
                "Expected CheckoutStepTwoPage but got different page"
            );
        }
        const checkoutPage = testedPage;
        const shippingInformationCount =
            await checkoutPage.shippingInformation.count();

        expect(shippingInformationCount).toBe(1);
        expect(checkoutPage.shippingInformation).not.toBe("");
    }
);
Then(
    "I should be able to see Item total price",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CheckoutStepTwoPage)) {
            throw new Error(
                "Expected CheckoutStepTwoPage but got different page"
            );
        }
        const checkoutPage = testedPage;

        const { elementCount: itemTotalCount, elementText: itemTotal } =
            await extractPrice(checkoutPage.itemTotal);
        expect(itemTotalCount).toBe(1);
        expect(itemTotal).not.toBe("");
    }
);
Then("I should be able to see Tax price", async function (this: CustomWorld) {
    const { testedPage } = getTestContext(this);
    if (!(testedPage instanceof CheckoutStepTwoPage)) {
        throw new Error("Expected CheckoutStepTwoPage but got different page");
    }
    const checkoutPage = testedPage;
    const { elementCount: taxCount, elementText: tax } = await extractPrice(
        checkoutPage.tax
    );
    expect(taxCount).toBe(1);
    expect(tax).not.toBe("");
});
Then("I should be able to see Price Total", async function (this: CustomWorld) {
    const { testedPage } = getTestContext(this);
    if (!(testedPage instanceof CheckoutStepTwoPage)) {
        throw new Error("Expected CheckoutStepTwoPage but got different page");
    }
    const checkoutPage = testedPage;
    const { elementCount: totalCount, elementText: total } = await extractPrice(
        checkoutPage.priceTotal
    );
    expect(totalCount).toBe(1);
    expect(total).not.toBe("");
});
Then(
    "I should see two buttons to cancel and finish",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        if (!(testedPage instanceof CheckoutStepTwoPage)) {
            throw new Error(
                "Expected CheckoutStepTwoPage but got different page"
            );
        }
        const checkoutPage = testedPage;

        const cancelButton = checkoutPage.cancelButton;
        const finishButton = checkoutPage.finishButton;

        await expect(cancelButton).toBeVisible();
        await expect(finishButton).toBeVisible();
    }
);
When("I click Finish", async function (this: CustomWorld) {
    const { testedPage } = getTestContext(this);
    if (!(testedPage instanceof CheckoutStepTwoPage)) {
        throw new Error("Expected CheckoutStepTwoPage but got different page");
    }
    const checkoutPage = testedPage;
    await checkoutPage.finishButton.click();
    await this.page.waitForLoadState("domcontentloaded");
});
//Complete
Then(
    "the url should change to {string}",
    async function (this: CustomWorld, string: string) {
        const checkoutPage = new CheckoutCompletePage(this.page!);
        this.testContext!.testedPage = checkoutPage;
        await expect(this.page).toHaveURL(string);
    }
);
Then(
    "I should see thanks for placing my order: {string}, {string}",
    async function (this: CustomWorld, string1: string, string2: string) {
        const { testedPage } = getTestContext(this);
        const checkoutPage = testedPage as CheckoutCompletePage;
        const completeText = await checkoutPage.completeText.innerText();
        await expect(checkoutPage.completeHeader).toHaveText(string1);
        await expect(checkoutPage.completeText).toHaveText(string2);
        await expect(checkoutPage.backHomeButton).toBeVisible();
    }
);
