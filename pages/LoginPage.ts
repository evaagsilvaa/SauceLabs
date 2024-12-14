import { Locator, Page, expect } from '@playwright/test';

/**
 * The LoginPage class encapsulates all the locators and methods to interact with the login page.
 */
export class LoginPage {
    readonly page: Page;
    private readonly loginLogo: Locator;
    private readonly username: Locator;
    private readonly password: Locator;
    private readonly loginBtn: Locator;
    private readonly robotImage: Locator;
    private readonly loginCredentials: Locator;
    private readonly loginPassword: Locator;
    private readonly errorMessage: Locator;
    private readonly errorBtn: Locator;

    /**
     * Initializes the LoginPage with a Playwright `Page` object.
     * @param page - The Playwright `Page` instance.
     */
    constructor(page: Page) {
        this.page = page;
        this.loginLogo = page.locator('.login_logo');
        this.username = page.locator('#user-name');
        this.password = page.locator('#password');
        this.loginBtn = page.locator('#login-button');
        this.robotImage = page.locator('.bot_column');
        this.loginCredentials = page.locator('#login_credentials');
        this.loginPassword = page.locator('.login_password');
        this.errorMessage = page.locator('//h3[@data-test="error"]');
        this.errorBtn = page.locator('.error-button');
    }

    /**
     * Navigates to the login page.
     */
    async navLogin(): Promise<void> {
        await this.page.goto('v1/index.html');
        await this.page.waitForURL('**/v1/index.html');
    }

    /**
     * Enters login credentials (username and password).
     * @param username - The username to enter.
     * @param password - The password to enter.
     */
    async enterLoginCredentials(username: string, password: string): Promise<void> {
        await this.enterUsername(username);
        await this.enterPassword(password);
    }

    /**
     * Enters a username into the username input field.
     * @param username - The username to input.
     */
    async enterUsername(username: string): Promise<void> {
        await this.username.fill(username);
    }

    /**
     * Enters a password into the password input field.
     * @param password - The password to input.
     */
    async enterPassword(password: string): Promise<void> {
        await this.password.fill(password);
    }

    /**
     * Verifies that all elements on the login page are visible and functioning correctly.
     */
    async verifyLoginPage(): Promise<void> {
        // Verify that all essential elements on the page are visible
        await expect.soft(this.loginLogo).toBeVisible();
        await expect(this.username).toBeVisible();
        await expect(this.password).toBeVisible();
        await expect(this.loginBtn).toBeVisible();
        await expect.soft(this.robotImage).toBeVisible();
        await expect.soft(this.loginCredentials).toBeVisible();
        await expect.soft(this.loginPassword).toBeVisible();

        // Ensure error messages are not visible on initial load
        await expect(this.errorMessage).not.toBeVisible();
        await expect(this.errorBtn).not.toBeVisible();

        // Verify input fields are empty by default
        await expect.soft(this.username).toHaveValue('');
        await expect.soft(this.password).toHaveValue('');
    }

    /**
     * Clicks on the login button to submit the login form.
     */
    async clickOnLoginBtn(): Promise<void> {
        await this.loginBtn.click();
    }

    /**
     * Verifies the error message is displayed with the correct text.
     * @param message - The expected error message text.
     */
    async verifyErrorMessage(message: string): Promise<void> {
        await expect(this.errorBtn).toBeVisible();
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toHaveText(message);
    }
}