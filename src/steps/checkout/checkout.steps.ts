import { When, Then, Given } from "@cucumber/cucumber";
import test, { expect, Locator } from "@playwright/test";
import { CustomWorld } from "../../support/world";
import ProductsPage from "../../pages/ProductsPage";
import { baseUrl, inventoryUrl, productDetailsUrl } from "../../utils/env";
import ProductDetailsPage from "../../pages/ProductDetailsPage";
import { mockProductData } from "../../../mocks/products";

When("I click the cart icon", async function (this: CustomWorld) {
});
Then("I should see the cart page", async function (this: CustomWorld) {
});
Then("cart item should be visible in cart list with name, description and price", async function (this: CustomWorld) {
});
Then("I should see two buttons to go back and continue", async function (this: CustomWorld) {
});