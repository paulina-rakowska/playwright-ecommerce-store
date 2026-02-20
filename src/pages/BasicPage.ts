import { Page } from "@playwright/test";
import fs from "fs";
import { user } from "../utils/env";

export default class BasicPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async gotoTheStore(url: string) {
        try {
            console.log("Basic go to the store");
            console.log(url);
            await this.page.goto(url);
            //  await this.page.waitForURL(url);
            await this.page.waitForLoadState("networkidle");
            console.log("Real url");
            console.log(this.page.url());

            if (url != this.page.url()) {
                const error = await this.page
                    .locator('[data-test="error"]')
                    .allTextContents();
                throw new Error(`Session expired: ${error}`);
            }
        } catch (e) {
            console.log("Session invalid, try again...");
            fs.unlinkSync(user.storageFile);
        }
    }

    async getCartBadgeCount(): Promise<number> {
        const cartBadgeElement = this.page.locator(
            '[data-test="shopping-cart-link"]'
        );
        const cartCount = await cartBadgeElement.textContent();
        console.log("cartCount");
        console.log(cartCount);
        return parseInt(cartCount || "0");
    }

    async clearCart(): Promise<void> {
        const currentCount = await this.getCartBadgeCount();
        console.log("Cart count before clearing:", currentCount);

        if (currentCount !== 0) {
            await this.page.evaluate(() =>
                localStorage.removeItem("cart-contents")
            );
            await this.page.reload();
            console.log("Cart cleared and page reloaded");
        } else {
            console.log("Cart already empty, no need to clear");
        }
    }
}
