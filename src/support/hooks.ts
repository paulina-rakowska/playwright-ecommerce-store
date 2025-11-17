import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { CustomWorld } from './world';

let browser: Browser;

// BeforeAll(async () => {
//     const browser = await browserType.launch({ headless: false });
//     const context = await browser.newContext();
//     const page = await context.newPage();
//     await page.goto(baseUrl);
//     await page.fill('#username', user.username);
//     await page.fill('#password', user.password);
//     await page.click('#login-button');
//     await page.waitForNavigation();
//     await context.storageState({ path: user.storageFile });
// });

BeforeAll(async function () {
    browser = await chromium.launch({ headless: true });
});

Before(async function(this: CustomWorld) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
})

After(async function(this: CustomWorld) {
    await this.page?.close();
    await this.context?.close();
})

AfterAll(async function() {
    await browser.close();
})