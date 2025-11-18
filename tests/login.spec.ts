import { test, expect } from "@playwright/test";
import { baseUrl, inventoryUrl } from "../src/utils/env";
import LoginPage from "../src/pages/LoginPage"
import { user } from "../src/utils/env";

// override storageState JUST for this file to be able to test login
test.use({ storageState: undefined });

test.describe('login tests', () => {
    test("logging standard_user", async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.gotoTheStore();
        await loginPage.login(user.username, user.password);

        await expect(page).toHaveURL(inventoryUrl);
    });

});