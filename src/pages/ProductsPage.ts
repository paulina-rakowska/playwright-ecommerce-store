import { type Locator, type Page } from "@playwright/test";
import { inventoryUrl, user } from '../utils/env';
import BasicPage from "./BasicPage";

export default class ProductsPage extends BasicPage {
    productElements?: Locator;
    productCount!: number;

    constructor(page: Page) {
        super(page);    
    }
    async getProducts(): Promise<void> {
        const products = this.page.locator(".inventory_item");
        this.productElements = products;
    }
    async getProductByIndex(index: number): Promise<Locator> {
        const product = index === 1 ? this.page.locator(".inventory_item").first() : this.page.locator(".inventory_item").nth(index);
        return product;
    }
    async getProductsCount(): Promise<number> {
        await this.getProducts();
        const count = await this.productElements!.count();
        this.productCount = count;
        return count;
    }
    async addProductToCart(product: Locator): Promise<Locator> {
        const addToCartButton = product.locator("button");
        await addToCartButton?.click();
        return addToCartButton;
    }
    async addAllProductsToCart(): Promise<void> {
        console.log(this.productElements);
    }   
}
