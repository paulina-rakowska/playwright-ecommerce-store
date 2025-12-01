import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { CustomWorld } from './world';
import { baseUrl, user } from "../utils/env";
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
        await loginPage.gotoTheStore(baseUrl);
        await loginPage.login(user.username, user.password);
        await world.context?.storageState({ path: user.storageFile });
    }
    else {
        console.log('Storage found, skipping login');
    }
}
async function createLoginContext(world: CustomWorld) {
    world.context = await browser!.newContext();
    world.page = await world.context.newPage();
}

BeforeAll(async function () {
    if (!browser) {
        browser = await chromium.launch({ headless: true });
    }
});
Before(async function (scenario) {
  // Get all tags from the scenario
  const tags = scenario.pickle.tags.map(tag => tag.name);
  
  // Check if a specific tag exists
  if (tags.includes('@notloggedin')) {
    console.log('Before hook as NOT LOGGED in user');
    await createLoginContext(this);
  }
  
  if (tags.includes('@loggedin')) {
    console.log('Before hook as LOGGED in user');
    await createAuthenticatedContext(this);
    // Setup API-specific configuration
  }
  
  
  console.log('All tags:', tags);
})

// Before({ tags: "@loggedin" }, async function (this: CustomWorld) {
//     console.log('Before hook as logged in user');
//     await createAuthenticatedContext(this);
// })

// Before({ tags: "@notloggedin" }, async function (this: CustomWorld) {
//     console.log('Before hook as not logged in user');
//     await createLoginContext(this);
// })

After(async function (this: CustomWorld) {
    await this.page?.close();
    await this.context?.close();
})

AfterAll(async function () {
    if (browser) {
        await browser.close();
    }
})