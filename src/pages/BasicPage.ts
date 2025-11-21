import { Page } from "@playwright/test";

export default class BasicPage {
    page: Page;
    startingUrl!: string;
    sessionUserName?: string;
    
    constructor(page: Page) {
        this.page = page;
    }

    async gotoTheStore(url: string) {
        console.log("Basic go to the store");
        console.log(url);
        await this.page.goto(url);
        await this.page.waitForURL(url);
        this.startingUrl = this.page.url();
    }   
}