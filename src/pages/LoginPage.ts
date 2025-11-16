import { expect, type Locator, type Page } from "@playwright/test";
import { baseUrl, inventorUrl, users } from '../utils/env';

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
    async loginAsStandardUser() {
        await this.login(users.standard.username, users.standard.password);
    }
    async loginAsLockoutUser() {
        await this.login(users.lockedOut.username, users.lockedOut.password);
    }
    async loginAsProblemUser() {
        await this.login(users.problem.username, users.problem.password);
    }
    async loginAsPerformanceUser() {
        await this.login(users.performance.username, users.performance.password);     
    }
    async loginAsErrorUser() {
        await this.login(users.error.username, users.error.password);        
    }
    async loginAsVisualUser() {
        await this.login(users.visual.username, users.visual.password);        
    }
    async login(username: string, password: string) {
        await this.usernameElement.fill(username);
        await this.passwordElement.fill(password);
        await this.loginButton.click();
        await this.page.waitForURL(inventorUrl);
    }
}
