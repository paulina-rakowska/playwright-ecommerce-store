import { type Locator, type Page } from "@playwright/test";
import BasicPage from "./BasicPage";

export default class ProductsPage extends BasicPage {
    readonly products: Locator;
    readonly productSortSelect: Locator;

    constructor(page: Page) {
        super(page);
        this.products = this.page.locator('[data-test="inventory-item"]');
        this.productSortSelect = this.page.locator(
            '[data-test="product-sort-container"]'
        );
    }
    //getter
    getButton(product: Locator): Locator {
        return product.getByRole("button");
    }

    async getProductByIndex(index: number): Promise<Locator> {
        // nth(0) =first()
        return this.products.nth(index);
    }

    async getProductsCount(): Promise<number> {
        return await this.products.count();
    }

    async addProductToCart(product: Locator): Promise<Locator> {
        const addToCartButton = product.locator("button");
        await addToCartButton.click();
        return addToCartButton;
    }

    async addAllProductsToCart(): Promise<Locator[]> {
        const buttons = await this.products.locator("button").all(); // returns Locator[]

        for (const button of buttons) {
            await button.click();
        }
        return buttons;
    }
    async getProductNames(): Promise<string[]> {
        const products = await this.products.all();
        const productNames = await Promise.all(
            products.map((product) =>
                product
                    .locator('[data-test="inventory-item-name"]')
                    .textContent()
            )
        );
        //filtering out nulls
        return productNames.filter(
            (productName): productName is string => productName !== null
        );
    }
    async getProductPrices(): Promise<number[]> {
        const products = await this.products.all();
        const productPrices = await Promise.all(
            products.map(async (product) => {
                let productPrice = await product
                    .locator('[data-test="inventory-item-price"]')
                    ?.textContent();
                if (!productPrice) {
                    return null;
                }
                return parseFloat(productPrice.replace("$", ""));
            })
        );
        //filtering out nulls
        return productPrices.filter((price): price is number => price !== null);
    }

    async clickSort(sortOrder: string) {
        const sortSelect = this.productSortSelect;
        await sortSelect.selectOption(sortOrder);
    }

    async sortProducts(products: string[] | number[], order: string) {
        let sortedProducts;
        switch (order) {
            case "A-Z":
                sortedProducts = [...products].sort((a, b) =>
                    a.localeCompare(b, undefined, { sensitivity: "accent" })
                );
                break;
            case "Z-A":
                sortedProducts = [...products].sort((a, b) =>
                    b.localeCompare(a, undefined, { sensitivity: "accent" })
                );
                break;
            case "low-high":
                sortedProducts = [...products].sort((a, b) => a - b);
                break;
            case "high-low":
                sortedProducts = [...products].sort((a, b) => b - a);
                break;
            default:
                throw new Error(`Unknown sort order: ${order}`);
        }
        return sortedProducts;
    }
}
