import { World as CucumberWorld } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';

export interface TestContext {
    testedPage: ProductsPage | ProductDetailsPage;
    testedUrl: string;
    initialCartCount: number;
}

export interface ICustomWorld extends CucumberWorld {
    context: BrowserContext;
    page: Page;
    testContext?: TestContext;  // Make this optional since it's set later
}