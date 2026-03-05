import { BeforeAll, AfterAll, Before, After } from "@cucumber/cucumber";
import { chromium, Browser } from "@playwright/test";
import { CustomWorld } from "./world";
import { baseUrl, user } from "../utils/env";
import LoginPage from "../pages/LoginPage";
import path from "path";
import fs from "fs";
import { setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

// 1. Dajemy Cucumberowi więcej czasu (np. 10s),
// żeby nie "ubijał" kroków przed Playwrightem.
setDefaultTimeout(10000);

// // 2. Ustawiamy, by każdy 'expect' czekał max 5s.
// // Dzięki temu po 5s bedzie błąd "locator.toBeVisible failed"
expect.configure({ timeout: 5000 });

let browser: Browser;

async function createAuthenticatedContext(world: CustomWorld) {
    const storagePath = path.resolve(user.storageFile);
    console.log("Using storageState file:", storagePath);
    const hasStorage = fs.existsSync(user.storageFile);
    console.log("hasStorage:", hasStorage);
    world.context = await browser!.newContext(
        hasStorage ? { storageState: user.storageFile } : undefined
    );
    world.page = await world.context.newPage();

    if (!hasStorage) {
        console.log("No storage found, logging in...");
        const loginPage = new LoginPage(world.page!);
        await loginPage.gotoTheStore(baseUrl);
        await loginPage.login(user.username, user.password);
        await world.context?.storageState({ path: user.storageFile });
    } else {
        console.log("Storage found, skipping login");
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
    const tags = scenario.pickle.tags.map((tag) => tag.name);

    if (tags.includes("@loggedin")) {
        console.log("Before hook as LOGGED in user");
        await createAuthenticatedContext(this);
        // Setup API-specific configuration
    }
    // Check if a specific tag exists
    else if (tags.includes("@notloggedin")) {
        console.log("Before hook as NOT LOGGED in user");
        await createLoginContext(this);
    }

    // Ustaw timeouty dla KAŻDEJ strony, niezależnie od sposobu logowania
    if (this.page) {
        // GLOBALNY timeout dla akcji (np. click, textContent, waitForSelector)
        this.page.setDefaultTimeout(5000);
        // GLOBALNY timeout dla nawigacji (np. goto, waitForLoadState)
        this.page.setDefaultNavigationTimeout(5000);
    }
    console.log("All tags:", tags);
});

// Before({ tags: "@loggedin" }, async function (this: CustomWorld) {
//     console.log('Before hook as logged in user');
//     await createAuthenticatedContext(this);
// })

// Before({ tags: "@notloggedin" }, async function (this: CustomWorld) {
//     console.log('Before hook as not logged in user');
//     await createLoginContext(this);
// })

After(async function (this: CustomWorld, scenario) {
    // 1. Sprawdzamy, czy scenariusz zakończył się błędem
    if (scenario.result?.status !== "PASSED") {
        if (this.page) {
            // 2. Definiujemy ścieżkę do folderu reports/screenshots
            const screenshotDir = path.join(
                process.cwd(),
                "reports",
                "screenshots"
            );

            // 3. Tworzymy folder, jeśli nie istnieje
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir, { recursive: true });
            }

            // 4. Tworzymy bezpieczną nazwę pliku (usuwamy znaki specjalne)
            const fileName = scenario.pickle.name
                .replace(/[^a-z0-9]/gi, "_")
                .toLowerCase();
            const screenshotPath = path.join(screenshotDir, `${fileName}.png`);

            const image = await this.page.screenshot({
                path: screenshotPath,
                fullPage: true
            });

            // 5. Załączamy do raportu Cucumbera (pamięć)
            await this.attach(image, "image/png");
        }
    }
    await this.page?.close();
    await this.context?.close();
});

AfterAll(async function () {
    if (browser) {
        await browser.close();
    }
});
