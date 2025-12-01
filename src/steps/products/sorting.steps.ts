import { When, Then, Given} from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CucumberWorld } from "../../support/world";
import ProductsPage from "../../pages/ProductsPage";
import { inventoryUrl } from "../../utils/env";

//AZ sorting
let testedPage: ProductsPage, initialCartCount: number;

When("I click Name (A to Z) option in product sort select", async function (this: CucumberWorld) {  
    testedPage.clickSort('az');
});
Then("product names should be sorted in alphabetic order A-Z", async function (this: CucumberWorld) {
   
});

//ZA sorting

When("I click Name (Z to A) option in product sort select", async function (this: CucumberWorld) {  
    testedPage.clickSort('za');
});
Then("product names should be sorted reversely to alphabetic order Z-A", async function (this: CucumberWorld) {

});

//LtH sorting

When("I click Price (low to high) option in product sort select", async function (this: CucumberWorld) {  
    testedPage.clickSort('lohi');
});
Then("product prices should be sorted from lowest to highest", async function (this: CucumberWorld) {

});

//HtL sorting

When("I click Price (high to low) option in product sort select", async function (this: CucumberWorld) {  
    testedPage.clickSort('hilo');
});
Then("product prices should be sorted from highest to lowest", async function (this: CucumberWorld) {

});