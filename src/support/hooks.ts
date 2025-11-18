import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { CustomWorld } from './world';
import { user } from "../utils/env";
import LoginPage from "../pages/LoginPage";
import path from 'path';
import fs from 'fs';

let browser: Browser;


async function createAuthenticatedContext(world: CustomWorld) {
      const storagePath = path.resolve(user.storageFile);
  console.log('Using storageState file:', storagePath);
    const hasStorage = fs.existsSync(user.storageFile);
      console.log('hasStorage:', hasStorage);
    world.context = await browser!.newContext(hasStorage ? { storageState: user.storageFile } : undefined);
    world.page = await world.context.newPage();

    if (!hasStorage) {
        console.log('No storage found, logging in...');
        const loginPage = new LoginPage(world.page!);
        await loginPage.gotoTheStore();
        await loginPage.login(user.username, user.password);
        await world.context?.storageState({ path: user.storageFile });
    }
    else {
        console.log('Storage found, skipping login');
    }
}

BeforeAll(async function () {
    browser = await chromium.launch({ headless: true });
});

Before(async function (this: CustomWorld) {
    await createAuthenticatedContext(this);
})

After(async function (this: CustomWorld) {
    await this.page?.close();
    await this.context?.close();
})

AfterAll(async function () {
    await browser.close();
})