import { Page } from "@playwright/test";

export default class BasicPage {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async gotoTheStore(url: string) {
        console.log("Basic go to the store");
        console.log(url);
        await this.page.goto(url);
        await this.page.waitForURL(url);
    }   

    async getCartBadgeCount(): Promise<number> {
        const cartBadgeElement =  this.page.locator('[data-test="shopping-cart-link"]');
        const cartCount = await cartBadgeElement.textContent();
        console.log("cartCount");
        console.log(cartCount);
        return parseInt(cartCount || '0');
    }

    async clearCart(): Promise<void> {
        const currentCount = await this.getCartBadgeCount();
        console.log("Cart count before clearing:", currentCount);
        
        if (currentCount !== 0) {
            await this.page.evaluate(() => localStorage.removeItem("cart-contents"));
            await this.page.reload();
            console.log("Cart cleared and page reloaded");
        } else {
            console.log("Cart already empty, no need to clear");
        }
    }

}