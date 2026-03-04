import { type Locator, type Page } from "@playwright/test";
import BasicPage from "./BasicPage";

export default class CartPage extends BasicPage {
    readonly cartIcon!: Locator;
    readonly cartItemsNames: Locator;
    readonly cartItemsDescs: Locator;
    readonly cartItemsPrices: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.cartItemsNames = page.locator('[data-test="inventory-item-name"]');
        this.cartItemsDescs = page.locator('[data-test="inventory-item-desc"]');
        this.cartItemsPrices = page.locator(
            '[data-test="inventory-item-price"]'
        );
        this.continueShoppingButton = page.locator(
            '[data-test="continue-shopping"]'
        );
        this.checkoutButton = page.locator('[data-test="checkout"]');
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
}
