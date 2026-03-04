import { World as CucumberWorld } from "@cucumber/cucumber";
import { BrowserContext, Page } from "@playwright/test";
import ProductsPage from "../pages/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CartPage from "../pages/CartPage";
import CheckoutStepOnePage from "../pages/CheckoutStepOnePage";
import CheckoutStepTwoPage from "../pages/CheckoutStepTwoPage";
import CheckoutCompletePage from "../pages/CheckoutCompletePage";
import LoginPage from "../pages/LoginPage";

export type TestedPage =
    | LoginPage
    | ProductsPage
    | ProductDetailsPage
    | CartPage
    | CheckoutStepOnePage
    | CheckoutStepTwoPage
    | CheckoutCompletePage;

export interface ProductData {
    id: number;
    productName: string;
    description: string;
    price: number;
    imageUrl: string;
}

export interface TestContext {
    testedPage: TestedPage;
    testedUrl: string | undefined;
    initialCartCount: number;
    productData?: ProductData[];
}

export interface ICustomWorld extends CucumberWorld {
    context: BrowserContext;
    page: Page;
    testContext?: TestContext; // Make this optional since it's set later
}
