import { type Locator, type Page } from "@playwright/test";
import BasicPage from "./BasicPage";

export default class CheckoutStepOnePage extends BasicPage {
    readonly cartIcon!: Locator;
    readonly cancelButton: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.continueButton = page.locator('[data-test="continue"]');
    }
    // getter
    get checkoutInputs() {
        return this.page.locator(
            '[data-test="checkout-info-container"] .form_input'
        );
    }
}
