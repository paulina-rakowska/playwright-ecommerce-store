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
        const product = index === 1 ? this.page.locator(".inventory_item").first() : this.page.locator(".inventory_item"); // to do index != 1
        return product;
    }
    async getProductButton(product: Locator): Promise<Locator> {
        const addToCartButton = product?.locator("button");
        return addToCartButton;
    }
    async getProductsCount(): Promise<number> {
        await this.getProducts();
        const count = await this.productElements!.count();
        this.productCount = count;
        return count;
    }
    async addFirstProductToCart(product: Locator): Promise<Locator> {
        const addToCartButton = product.locator("button");
        await addToCartButton?.click();
        return addToCartButton;
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
