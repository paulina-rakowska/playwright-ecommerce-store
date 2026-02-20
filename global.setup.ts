import { chromium, type FullConfig } from "@playwright/test";
import LoginPage from "./src/pages/LoginPage";
import ProductsPage from "./src/pages/ProductsPage.ts";
import { baseUrl, inventoryUrl, user } from "./src/utils/env";
import fs from "fs";

async function globalSetup(config: FullConfig) {
    const testFiles = process.argv.slice(2);

    if (testFiles.some((file) => file.includes("login.spec.ts"))) {
        console.log("Running login tests, skipping global setup");
        return;
    }
    console.log("globalSetup");

    const hasStorage = fs.existsSync(user?.storageFile);

    if (hasStorage) {
        console.log("Using storage state file");
        // const productsPage = new ProductsPage(page);
        // productsPage.gotoTheStore(inventoryUrl);
        return;
    } else {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        console.log("Logging in user and creating storage state");
        const loginPage = new LoginPage(page);

        await loginPage.gotoTheStore(baseUrl);
        await loginPage.login(user.username, user.password);

        // Wait for a specific network idle state to ensure all cookies are "settled"
        await page.waitForLoadState("networkidle");
        await context.storageState({ path: user.storageFile });

        await browser.close();
    }
}

export default globalSetup;
