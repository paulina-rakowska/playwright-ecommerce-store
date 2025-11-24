import { type Locator, type Page } from "@playwright/test";
import { baseUrl, inventoryUrl } from '../utils/env';
import BasicPage from "./BasicPage";

export default class ProductDetailsPage extends BasicPage {

    constructor(page: Page) {
        super(page);
    }
    getButton(): Locator {
        return this.page.locator('.btn_inventory');
    }

    async getProductIds(products: { id: number, productName: string, description: string, price: number, imageUrl: string } [] ): Promise<number[]> {
        console.log("inside getProductsIds")
        console.log(products);
        const productIds = products.map((product) => product.id);
        console.log(productIds);
        return productIds;
    }
}
