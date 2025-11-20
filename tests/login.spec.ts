import { test, expect } from "@playwright/test";
import { baseUrl, inventoryUrl } from "../src/utils/env";
import LoginPage from "../src/pages/LoginPage"
import { user } from "../src/utils/env";

// override storageState JUST for this file to be able to test login
test.use({ 
  storageState: { cookies: [], origins: [] } 
});

test.describe('login tests', () => {
    test("logging standard_user", async ({ page, context }) => {
        const loginPage = new LoginPage(page);

        await loginPage.gotoTheStore(baseUrl);
        await loginPage.login(user.username, user.password);
        await context.storageState({ path: user.storageFile });
        await expect(page).toHaveURL(inventoryUrl);
    });

});