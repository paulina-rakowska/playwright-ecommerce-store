import { type Locator, type Page } from "@playwright/test";
import BasicPage from "./BasicPage";

export default class CheckoutStepTwoPage extends BasicPage {
    readonly cartIcon!: Locator;
    readonly cartItemsNames: Locator;
    readonly cartItemsDescs: Locator;
    readonly cartItemsPrices: Locator;
    readonly paymentInformation: Locator;
    readonly shippingInformation: Locator;
    readonly itemTotal: Locator;
    readonly tax: Locator;
    readonly priceTotal: Locator;
    readonly cancelButton: Locator;
    readonly finishButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.cartItemsNames = page.locator('[data-test="inventory-item-name"]');
        this.cartItemsDescs = page.locator('[data-test="inventory-item-desc"]');
        this.cartItemsPrices = page.locator(
            '[data-test="inventory-item-price"]'
        );
        this.paymentInformation = page.locator(
            '[data-test="payment-info-value"]'
        );
        this.shippingInformation = page.locator(
            '[data-test="shipping-info-value"]'
        );
        this.itemTotal = page.locator('[data-test="subtotal-label"]');
        this.tax = page.locator('[data-test="tax-label"]');
        this.priceTotal = page.locator('[data-test="total-label"]');
        this.cancelButton = page.locator('[data-test="cdancel"]');
        this.finishButton = page.locator('[data-test="finish"]');
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

    async getPaymentInformation(): Promise<string[]> {
        return await this.cartItemsNames.allTextContents();
    }
    async getShippingInformation(): Promise<string[]> {
        return await this.cartItemsDescs.allTextContents();
    }
    async getItemTotal(): Promise<string[]> {
        return await this.cartItemsPrices.allTextContents();
    }
    async getTax(): Promise<string[]> {
        return await this.cartItemsPrices.allTextContents();
    }
    async getPriceTotal(): Promise<string[]> {
        return await this.cartItemsPrices.allTextContents();
    }
}
