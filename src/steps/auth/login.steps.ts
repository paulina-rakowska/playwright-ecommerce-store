import { When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../support/world";
import LoginPage from "../../pages/LoginPage";
import { user, inventoryUrl, baseUrl } from "../../utils/env";

When("I log in as a standard user", async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page!);

    await loginPage.gotoTheStore(baseUrl);
    await loginPage.login(user.username, user.password);
    await this.context?.storageState({ path: user.storageFile });
});

Then(
    "I should be redirected to the inventory page",
    async function (this: CustomWorld) {
        await expect(this.page!).toHaveURL(inventoryUrl);
    }
);
