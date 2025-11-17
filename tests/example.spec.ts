import { test, expect } from "@playwright/test";
import LoginPage from "../src/pages/LoginPage";
import { user, inventoryUrl } from "../src/utils/env";

test("logging standard_user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoTheStore();
    await loginPage.login(user.username, user.password);

    await expect(page).toHaveURL(inventoryUrl);
});

// test("logging lockout_user", async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     await loginPage.gotoTheStore();
//     await loginPage.login(user.username, user.password);

//     await expect(page.locator('.error-button')).toBeVisible();
// });
