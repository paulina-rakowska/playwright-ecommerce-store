import { When, Then, Given} from "@cucumber/cucumber";

Given("I am on the inventory page", async function (this: CucumberWorld) {  
    const productPage = new ProductsPage(this.page!);
    await productPage.gotoTheStore(inventoryUrl);
    this.page = productPage.page;
    (this as any).productPage = productPage;
    expect(this.page!).toHaveURL(inventoryUrl);
});

Then("I should see at least one product", async function (this: CucumberWorld) {
    const productPage = (this as any).productPage as ProductsPage;
    const count = await productPage.getProductsCount();

    expect(count).toBeGreaterThan(0);
});