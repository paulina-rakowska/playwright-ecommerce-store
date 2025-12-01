import { type Locator, type Page } from "@playwright/test";
import BasicPage from "./BasicPage";

export default class ProductsPage extends BasicPage {
    constructor(page: Page) {
        super(page);    
    }

    // Simplified - just return the locator
    getProducts(): Locator {
        return this.page.locator('[data-test="inventory-item"]');
    }
    getButton(product: Locator): Locator {
        return product.getByRole('button');
    }
    getProductSortSelect() {
        return this.page.locator('[data-test="product-sort-container"]');
     
    }
    async getProductByIndex(index: number): Promise<Locator> {
        // nth(0) =first()
        return this.getProducts().nth(index);
    }

    async getProductsCount(): Promise<number> {
        return await this.getProducts().count();
    }

    async addProductToCart(product: Locator): Promise<Locator> {
        console.log('product added');
        let prod = await product.locator('[data-test="inventory-item-name"]').textContent();
        console.log(prod);
        const addToCartButton = product.locator("button");
        await addToCartButton.click(); 
        return addToCartButton;
    }

    async addAllProductsToCart(): Promise<Locator[]> {
        const buttons = await this.getProducts()
            .locator("button")
            .all();   // returns Locator[]

        for (const button of buttons) {
            await button.click();
        }
        return buttons;
    }
    async clickSort(sortOrder: string){
        const sortSelect = this.getProductSortSelect();
        switch(sortOrder){
            case "az": 
                await sortSelect.selectOption('az');
            break;
            case "za": 
                await sortSelect.selectOption('za');
            break;
            case "lohi": 
                await sortSelect.selectOption('lohi');
            break;
            case "hilo": 
                await sortSelect.selectOption('hilo');
            break;
        }
    }
}