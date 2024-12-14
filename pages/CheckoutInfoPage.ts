import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage.ts';

/**
 * Represents the Checkout Information page, extending the BasePage to include 
 * functionality for filling in user details, verifying fields, and handling errors.
 */
export class CheckoutInfoPage extends BasePage {
  private readonly subHeaderLocator: Locator;
  private readonly firstNameFieldLocator: Locator;
  private readonly lastNameFieldLocator: Locator;
  private readonly zipFieldLocator: Locator;
  private readonly errorMessageLocator: Locator;
  private readonly cancelBtnLocator: Locator;
  private readonly continueBtnLocator: Locator;

  /**
   * Initializes the CheckoutInfoPage with a Playwright `Page` object and locale for translations.
   * @param page - The Playwright `Page` instance.
   * @param locale - The locale code used to load translations.
   */
  constructor(page: Page, locale: string) {
      super(page, locale);

      // Initialize locators for checkout information page elements
      this.subHeaderLocator = page.locator('.subheader');
      this.firstNameFieldLocator = page.locator('#first-name');
      this.lastNameFieldLocator = page.locator('#last-name');
      this.zipFieldLocator = page.locator('#postal-code');
      this.errorMessageLocator = page.locator('//h3[@data-test="error"]');
      this.cancelBtnLocator = page.locator('.cart_cancel_link');
      this.continueBtnLocator = page.locator('//input[@type="submit"]');
  }

  /**
   * Verifies the Checkout Information page, ensuring all fields, buttons, and headers 
   * are displayed and have the correct attributes or text.
   * @param cartCount - The expected number of items in the shopping cart.
   */
  async verifyCheckoutInfoPage(cartCount: number): Promise<void> {
      // ------------ Verify Page Header ------------ //
      await this.verifyPageHeader(cartCount);

      // ------------ Verify Subheader ------------ //
      await expect.soft(this.subHeaderLocator).toBeVisible(); // Verify subheader visibility
      await expect.soft(this.subHeaderLocator).toHaveText(this.translations.headers.checkoutInfo); // Verify subheader text

      // ------------ Verify Input Fields ------------ //
      // Verify "First Name" field
      await expect.soft(this.firstNameFieldLocator).toBeVisible();
      await expect.soft(this.firstNameFieldLocator).toHaveAttribute("placeholder", this.translations.checkoutInfo.firstName);

      // Verify "Last Name" field
      await expect.soft(this.lastNameFieldLocator).toBeVisible();
      await expect.soft(this.lastNameFieldLocator).toHaveAttribute("placeholder", this.translations.checkoutInfo.lastName);

      // Verify "Postal Code" field
      await expect.soft(this.zipFieldLocator).toBeVisible();
      await expect.soft(this.zipFieldLocator).toHaveAttribute("placeholder", this.translations.checkoutInfo.zip);

      // ------------ Verify Buttons ------------ //
      // Verify "Cancel" button
      await expect(this.cancelBtnLocator).toBeVisible();
      await expect.soft(this.cancelBtnLocator).toHaveText(this.translations.buttons.cancelBtnText);

      // Verify "Continue" button
      await expect(this.continueBtnLocator).toBeVisible();
      await expect.soft(this.continueBtnLocator).toHaveText(this.translations.buttons.continueBtnText);

      // ------------ Verify Footer ------------ //
      await this.verifyFooter();
  }

  /**
   * Fills in the "First Name" field with the provided value.
   * @param firstName - The first name to be entered.
   */
  async enterFirstName(firstName: string): Promise<void> {
      await this.firstNameFieldLocator.fill(firstName);
  }

  /**
   * Fills in the "Last Name" field with the provided value.
   * @param lastName - The last name to be entered.
   */
  async enterLastName(lastName: string): Promise<void> {
      await this.lastNameFieldLocator.fill(lastName);
  }

  /**
   * Fills in the "Postal Code" field with the provided value.
   * @param zip - The postal code to be entered.
   */
  async enterZip(zip: string): Promise<void> {
      await this.zipFieldLocator.fill(zip);
  }

  /**
   * Verifies that the displayed error message matches the expected text.
   * @param message - The expected error message.
   */
  async verifyErrorMessage(message: string): Promise<void> {
      await expect(this.errorMessageLocator).toBeVisible(); // Ensure the error message is visible
      await expect(this.errorMessageLocator).toHaveText(message); // Verify the error message text
  }

  /**
   * Clicks the 'Cancel' button to navigate back to the previous page.
   */
  async clickOnCancel(): Promise<void> {
      // Ensure the "Cancel" button is visible before interaction
      await expect(this.cancelBtnLocator).toBeVisible();
      await this.cancelBtnLocator.click();
  }

  /**
   * Clicks the 'Continue' button to proceed to the next step in the checkout process.
   */
  async clickOnContinue(): Promise<void> {
      // Ensure the "Continue" button is visible before interaction
      await expect(this.continueBtnLocator).toBeVisible();
      await this.continueBtnLocator.click();
  }
}