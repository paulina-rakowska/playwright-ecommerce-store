import { type Locator, type Page } from "@playwright/test";
import { inventoryUrl, user } from '../utils/env';
import BasicPage from "./BasicPage";

export default class ProductsPage extends BasicPage {
    productElements?: Locator;
    productCount!: number;

    constructor(page: Page) {
        super(page);    
    }
    async loadSessionUserName(): Promise<void> {
        this.sessionUserName = await this.getUserCookie("session-username");
    }
    async getProductsCount(): Promise<number> {
        const products = this.page.locator(".inventory_item");
        const count = await products.count();
        this.productElements = products;
        this.productCount = count;
        return count;
    }
    async addFirstProductToCart(): Promise<void> {
        const firstProduct = this.productElements?.first();
        const addToCartButton = firstProduct?.locator("button");
        await addToCartButton?.click();
    }
    async addProductByName(productName: string): Promise<void> {
        console.log(this.productElements);
        console.log(productName);
       // const selectedProduct = this.productElements?.find((product) => product.);
    }   
    async addRandomProductToCart(): Promise<void> {
        const randomProduct = this.productElements?.nth(Math.floor(Math.random() * this.productCount!));
        const addToCartButton = randomProduct?.locator("button");
        await addToCartButton?.click();
    }
}
