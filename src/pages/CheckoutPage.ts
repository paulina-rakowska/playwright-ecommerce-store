import { type Locator, type Page } from "@playwright/test";
import BasicPage from "./BasicPage";

export default class CheckoutPage extends BasicPage {
    readonly cartIcon!: Locator;
    readonly cartItemsNames: Locator;
    readonly cartItemsDescs: Locator;
    readonly cartItemsPrices: Locator;

    constructor(page: Page) {
        super(page);
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.cartItemsNames = page.locator('[data-test="inventory-item-name"]');
        this.cartItemsDescs = page.locator('[data-test="inventory-item-desc"]');
        this.cartItemsPrices = page.locator(
            '[data-test="inventory-item-price"]'
        );
    }

    async getCartItemsNames(): Promise<string[]> {
        return await this.cartItemsNames.allTextContents();
    }
    async getCartItemsDescs(): Promise<string[]> {
        return await this.cartItemsDescs.allTextContents();
    }
    async getCartItemsPrices(): Promise<string[]> {
        return await this.cartItemsPrices.allTextContents();
    }
    //getter
    getContinueShoppingButton(): Locator {
        return this.page.locator('[data-test="continue-shopping"]');
    }
    getCheckoutButton(): Locator {
        return this.page.locator('[data-test="checkout"]');
    }
}
