import { When, Then, Given} from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "../support/world";
import ProductsPage from "../pages/ProductsPage";
import { inventoryUrl } from "../utils/env";

Given("I am on the inventory page", async function (this: CucumberWorld) {  
    const productsPage = new ProductsPage(this.page!);
    await productsPage.gotoTheStore(inventoryUrl);
    this.page = productsPage.page;
    (this as any).productsPage = productsPage;
    expect(this.page!).toHaveURL(inventoryUrl);
});

When("I add first product to the cart", async function (this: CucumberWorld) {
    const productPage = (this as any).productPage as ProductsPage;
    const count = await productPage.getProductsCount();

    expect(count).toBeGreaterThan(0);
});

Then("cart badge should be incremented", async function (this: CucumberWorld) {
});

Then("text on the button which was clicked should change to \"Remove\"", async function (this: CucumberWorld) {
});