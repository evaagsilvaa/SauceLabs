import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import shared from '../locales/shared.json';

/**
 * The CompletePage class encapsulates methods and locators for interacting with the "Complete" page of the application.
 */
export class CompletePage extends BasePage {
    private readonly subHeaderLocator: Locator;
    private readonly completeHeaderLocator: Locator;
    private readonly completeTextLocator: Locator;
    private readonly ponyExpressImgLocator: Locator;

    /**
     * Initializes the CompletePages with a Playwright `Page` object and locale for translations.
     * @param page - The Playwright `Page` instance.
     * @param locale - The locale code used to load translations.
     */
    constructor(page: Page, locale: string) {
        super(page, locale);

        // Initialize locators for complete page elements
        this.subHeaderLocator = page.locator('.subheader');                 // Subheader locator
        this.completeHeaderLocator = page.locator('.complete-header');     // Header for "Thank You" message
        this.completeTextLocator = page.locator('.complete-text');         // Text message locator
        this.ponyExpressImgLocator = page.locator('.pony_express');        // Pony Express image locator
    }

    /**
     * Verifies the redirection to the Complete page.
     * This method ensures that all critical elements of the Complete page are visible and contain the correct text or attributes.
     */
    async verifyRedirectionToCompletePage(): Promise<void> {
        // ------------ Verify Page Header ---------- //
        await this.verifyPageHeader(0);  // Verify the global page header with no cart count.

        // -------- Verify Secondary Header --------- //
        await expect.soft(this.subHeaderLocator).toBeVisible();                      // Check if the subheader is visible.
        await expect.soft(this.subHeaderLocator).toHaveText(this.translations.headers.finish);  // Verify subheader text matches the localized translation.

        // ----------- Verify Fields --------- //
        // Verify the "Thank You" header
        await expect(this.completeHeaderLocator).toBeVisible();                 // Ensure the header is visible.
        await expect.soft(this.completeHeaderLocator).toHaveText(this.translations.general.thankYouText);  // Verify header text matches the localized translation.

        // Verify the order completion message
        await expect(this.completeTextLocator).toBeVisible();                   // Ensure the order message is visible.
        await expect.soft(this.completeTextLocator).toHaveText(this.translations.general.orderText);  // Verify order message matches the localized translation.

        // Verify the Pony Express image
        await expect(this.ponyExpressImgLocator).toBeVisible();                 // Ensure the image is visible.
        await expect.soft(this.ponyExpressImgLocator).toHaveAttribute("src", shared.footer.ponyExpressSrc);  // Validate the image source matches the expected value.
    }
}