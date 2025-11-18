import { type Locator, type Page } from "@playwright/test";
import { inventoryUrl, user } from '../utils/env';
import BasicPage from "./BasicPage";

export default class ProductsPage extends BasicPage {
    productElements?: Locator;

    constructor(page: Page) {
        super(page);    
    }
    async loadSessionUserName(): Promise<void> {
        this.sessionUserName = await this.getUserCookie("session-username");
    }
    async checkProductsCount(): Promise<number> {
        const products = this.page.locator(".inventory_item");
        const count = await products.count();
        this.productElements = products;
        return count;
    }
}
