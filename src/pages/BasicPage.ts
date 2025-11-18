import { Page } from "@playwright/test";

export default class BasicPage {
    page: Page;
    startingUrl!: string;
    sessionUserName?: string;
    
    constructor(page: Page) {
        this.page = page;
    }

    async gotoTheStore(startingUrl: string) {
        await this.page.goto(startingUrl);
        this.startingUrl = this.page.url();
    }   
    async getUserCookie(cookieName: string): Promise<string> {
        const cookies = await this.page.context().cookies();
        const sessionCookie = cookies.find((c) => c.name === cookieName);
        return sessionCookie?.value || '';
    }
}