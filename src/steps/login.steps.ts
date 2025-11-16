import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { World } from "../support/world";
import LoginPage from "../pages/LoginPage";
import { inventoryUrl } from "../utils/env";

When("I log in as a standard user", async function (this: World) {
    const loginPage = new LoginPage(this.page);

    await loginPage.gotoTheStore();
    await loginPage.loginAsStandardUser();
});

Then("I should be redirected to the inventory page", async function (this: World) {
    await expect(this.page).toHaveURL(inventoryUrl);
});