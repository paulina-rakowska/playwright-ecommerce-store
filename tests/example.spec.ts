import { test, expect } from "@playwright/test";
import LoginPage from "../src/pages/LoginPage";
import { inventoryUrl } from "../src/utils/env";

test("logging standard_user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoTheStore();
    await loginPage.loginAsStandardUser();

    await expect(page).toHaveURL(inventoryUrl);
});

test("logging lockout_user", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoTheStore();
    await loginPage.loginAsLockoutUser();

    await expect(page.locator('.error-button')).toBeAttached();
});
