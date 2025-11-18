import { type Locator, type Page } from "@playwright/test";
import { baseUrl, inventoryUrl } from '../utils/env';
import BasicPage from "./BasicPage";

export default class ProductDetailsPage extends BasicPage {

    constructor(page: Page) {
        super(page);
    }

}
