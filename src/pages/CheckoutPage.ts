import { type Locator, type Page } from "@playwright/test";
import BasicPage from "./BasicPage";

export default class CheckoutPage extends BasicPage {
    cartIcon!: Locator;
    cartList: Locator;
    constructor(page: Page) {
        super(page);
    }
}