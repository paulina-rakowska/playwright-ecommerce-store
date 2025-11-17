import { expect, type Locator, type Page } from "@playwright/test";
import { baseUrl, inventoryUrl } from '../utils/env';

export default class LoginPage {
    usernameElement!: Locator;
    passwordElement!: Locator;
    loginButton!: Locator;

    constructor(private page: Page) {
        this.page = page;
    }
    async gotoTheStore() {
        await this.page.goto(baseUrl);
        this.usernameElement = this.page.getByPlaceholder("Username");
        this.passwordElement = this.page.getByPlaceholder("Password");
        this.loginButton = this.page.getByRole("button", { name: "Login" });
    }
    async login(username: string, password: string) {
        if(!username || !password) {
            throw new Error("Username and password are required");
        }
        await this.usernameElement.fill(username);
        await this.passwordElement.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL(inventoryUrl);
    }
}
