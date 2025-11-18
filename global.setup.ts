import { chromium } from '@playwright/test';
import LoginPage from './src/pages/LoginPage';
import { user } from './src/utils/env';

async function globalSetup() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);

    await loginPage.gotoTheStore();
    await loginPage.login(user.username, user.password);
    await context.storageState({ path: user.storageFile });
    await browser.close();
}

export default globalSetup;