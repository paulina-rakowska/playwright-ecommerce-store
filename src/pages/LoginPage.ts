import { type Locator, type Page } from "@playwright/test";
import { baseUrl, inventoryUrl } from '../utils/env';
import BasicPage from "./BasicPage";

export default class LoginPage extends BasicPage {
    usernameElement!: Locator;
    passwordElement!: Locator;
    loginButton!: Locator;

    constructor(page: Page) {
        super(page);
    }
    async gotoTheStore(url: string) {
            console.log("Login go to the store");
        await super.gotoTheStore(url);
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
