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

Given(
    "There is at least one product in the cart",
    async function (this: CustomWorld) {
        console.log("There is at least one product in the cart");
        const { testedPage, initialCartCount } = getTestContext(this);
        const productsPage = testedPage as ProductsPage;
        let productToBeAdded;
        if (initialCartCount === 0) {
            console.log("nothing is added to the cart");
            let productsCount = await productsPage.getProductsCount();
            let productIndex =
                productsCount > 0
                    ? Math.floor(Math.random() * productsCount)
                    : 0;
            console.log("productIndex " + productIndex);
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
//Step 1
When("I click the cart icon", async function (this: CustomWorld) {
    console.log("I am on Checkout step");
    const cartPage = new CartPage(this.page!);
    await cartPage.cartIcon.click();
    this.testContext = {
        ...this.testContext,
        testedPage: cartPage
    };
});
//Cart page
Then("I should see the cart page", async function (this: CustomWorld) {
    await expect(this.page!).toHaveURL(cartUrl);
});
Then(
    "cart item should be visible in cart list with name, description and price",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        const cartPage = testedPage as CartPage;
        const names = await cartPage.getCartItemsNames();
        const descriptions = await cartPage.getCartItemsDescs();
        const prices = await cartPage.getCartItemsPrices();
        console.log("names ");
        console.log(names);
        console.log("descriptions ");
        console.log(descriptions);
        console.log("prices ");
        console.log(prices);

        //if there is at least one product- arrays should contain at least one string
        expect(names.length).toBeGreaterThan(0);
        expect(descriptions.length).toBeGreaterThan(0);
        expect(prices.length).toBeGreaterThan(0);

        names.forEach(async (name: string) => expect(name).not.toBe(""));
        descriptions.forEach(async (description: string) =>
            expect(description).not.toBe("")
        );
        prices.forEach(async (price: string) => expect(price).not.toBe(""));
    }
);
Then(
    "I should see two buttons to checkout or continue shopping",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        const checkoutPage = testedPage as CartPage;
        const continueShopping = checkoutPage.continueShoppingButton;
        const checkout = checkoutPage.checkoutButton;

        await expect(continueShopping).toBeVisible();
        await expect(checkout).toBeVisible();
    }
);
When("I click Checkout button", async function (this: CustomWorld) {
    const { testedPage } = getTestContext(this);
    const cartPage = testedPage as CartPage;
    cartPage.checkoutButton.click();
    await this.page.waitForURL(checkoutStepOneUrl);
});
//Step 1
Then("I should see the form with 3 inputs", async function (this: CustomWorld) {
    const checkoutPage = new CheckoutStepOnePage(this.page!);

    const inputsLength = (await checkoutPage.checkoutInputs)?.length;
    this.testContext = {
        ...this.testContext,
        testedPage: checkoutPage
    };
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
        const checkoutPage = testedPage as CheckoutStepOnePage;
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
        const checkoutPage = testedPage as CheckoutStepOnePage;
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
        const checkoutPage = testedPage as CheckoutStepOnePage;

        const cancelButton = checkoutPage.cancelButton;
        const continueButton = checkoutPage.continueButton;

        await expect(cancelButton).toBeVisible();
        await expect(continueButton).toBeVisible();
    }
);
When("I click Continue", async function (this: CustomWorld) {
    const { testedPage } = getTestContext(this);
    const checkoutPage = testedPage as CheckoutStepOnePage;
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
        console.log("names ");
        console.log(names);
        console.log("descriptions ");
        console.log(descriptions);
        console.log("prices ");
        console.log(prices);
        this.testContext = {
            ...this.testContext,
            testedPage: checkoutPage
        };

        //if there is at least one product- arrays should contain at least one string
        expect(names.length).toBeGreaterThan(0);
        expect(descriptions.length).toBeGreaterThan(0);
        expect(prices.length).toBeGreaterThan(0);

        names.forEach(async (name: string) => expect(name).not.toBe(""));
        descriptions.forEach(async (description: string) =>
            expect(description).not.toBe("")
        );
        prices.forEach(async (price: string) => expect(price).not.toBe(""));
    }
);
Then(
    "I should be able to see payment information",
    async function (this: CustomWorld) {
        const { testedPage } = getTestContext(this);
        const checkoutPage = testedPage as CheckoutStepTwoPage;
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
        const checkoutPage = testedPage as CheckoutStepTwoPage;
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
        const checkoutPage = testedPage as CheckoutStepTwoPage;
        const itemTotalCount = await checkoutPage.itemTotal.count();
        const subTotal = await checkoutPage.itemTotal.innerText();
        const itemTotal = subTotal.match(/\d+\.?\d*/)?.[0] ?? "";

        expect(itemTotalCount).toBe(1);
        expect(itemTotal).not.toBe("");
    }
);
Then(
    "I should be able to see Tax price",
    async function (this: CustomWorld) {}
);
Then(
    "I should be able to see Price Total",
    async function (this: CustomWorld) {}
);
Then(
    "I should see two buttons to cancel and finish",
    async function (this: CustomWorld) {}
);
