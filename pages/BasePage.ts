import { Locator, Page, expect } from '@playwright/test';
import { Translations } from '../types/translations';
import { loadTranslations } from '../utils/translationsHelper';
import shared from '../locales/shared.json';

/**
 * Represents the base page object model that includes shared locators 
 * and utility methods for interacting with common UI elements.
 */
export class BasePage {
  readonly page: Page;
  readonly translations: Translations;
  private readonly appLogo: Locator;
  private readonly burgerMenuBtn: Locator;
  private readonly burgerMenuAllItems: Locator;
  private readonly burgerMenuAbout: Locator;
  private readonly burgerMenuLogout: Locator;
  private readonly burgerMenuReset: Locator;
  private readonly shoppingCart: Locator;
  private readonly shoppingCartItemsCounter: Locator;
  private readonly footer: Locator;
  private readonly socialTwitter: Locator;
  private readonly socialFacebook: Locator;
  private readonly socialLinkedIn: Locator;
  private readonly footerCopy: Locator;
  private readonly footerRobot: Locator;

  /**
   * Initializes the BasePage with a Playwright `Page` object and locale for translations.
   * @param page - The Playwright `Page` instance.
   * @param locale - The locale code used to load translations.
   */
  constructor(page: Page, locale: string) {
      this.page = page;
      this.translations = loadTranslations(locale); // Load translations based on the locale
      
      // Initialize locators for commonly used elements
      this.appLogo = page.locator('.app_logo');
      this.burgerMenuBtn = page.locator('.bm-burger-button button');
      this.burgerMenuAllItems = page.locator('#inventory_sidebar_link');
      this.burgerMenuAbout = page.locator('#about_sidebar_link');
      this.burgerMenuLogout = page.locator('#logout_sidebar_link');
      this.burgerMenuReset = page.locator('#reset_sidebar_link');
      this.shoppingCart = page.locator('#shopping_cart_container');
      this.shoppingCartItemsCounter = page.locator('.shopping_cart_badge');
      this.footer = page.locator('.footer');
      this.socialTwitter = this.footer.locator('.social .social_twitter');
      this.socialFacebook = this.footer.locator('.social .social_facebook');
      this.socialLinkedIn = this.footer.locator('.social .social_linkedin');
      this.footerCopy = this.footer.locator('.footer_copy');
      this.footerRobot = this.footer.locator('.footer_robot');
  }

  /**
   * Verifies the page's header elements and the shopping cart counter.
   * @param cartCount - The expected number of items in the shopping cart. Defaults to 0.
   */
  async verifyPageHeader(cartCount: number = 0): Promise<void> {
      // Verify the page title matches the expected value from shared translations
      await expect(this.page).toHaveTitle(shared.general.titleTab);

      // Verify the visibility of key page elements
      await expect.soft(this.appLogo).toBeVisible(); // App logo
      await expect(this.burgerMenuBtn).toBeVisible(); // Burger menu button
      await expect(this.shoppingCart).toBeVisible(); // Shopping cart icon

      // Verify the cart item count
      await this.verifyCartCount(cartCount);
  }

  /**
   * Verifies the visibility and count of items in the shopping cart.
   * @param cartCount - The expected number of items in the shopping cart.
   */
  async verifyCartCount(cartCount: number): Promise<void> {
      if (cartCount === 0) {
          // Ensure the cart counter is not visible when the count is 0
          await expect(this.shoppingCartItemsCounter).not.toBeVisible();
      } else {
          // Verify the cart counter is visible and matches the expected count
          await expect(this.shoppingCartItemsCounter).toBeVisible();
          await expect(this.shoppingCartItemsCounter).toHaveText(cartCount.toString());
      }
  }

  /**
   * Clicks on the shopping cart icon to navigate to the cart page.
   */
  async clickOnCartIcon(): Promise<void> {
      // Verify the shopping cart icon is visible before interaction
      await expect(this.shoppingCart).toBeVisible();
      await this.shoppingCart.click();
  }

  /**
   * Opens the burger menu by clicking the menu button.
   */
  async openBurgerMenu(): Promise<void> {
      // Ensure the burger menu button is visible before clicking
      await expect(this.burgerMenuBtn).toBeVisible();
      await this.burgerMenuBtn.click();
  }

  /**
   * Clicks on the "All Items" option in the burger menu.
   */
  async clickOnAllItemsMenu(): Promise<void> {
      // Ensure the "All Items" menu option is visible before clicking
      await expect(this.burgerMenuAllItems).toBeVisible();
      await this.burgerMenuAllItems.click();
  }

  /**
   * Clicks on the "About" option in the burger menu.
   */
  async clickOnAboutMenu(): Promise<void> {
      // Ensure the "About" menu option is visible before clicking
      await expect(this.burgerMenuAbout).toBeVisible();
      await this.burgerMenuAbout.click();
  }

  /**
   * Clicks on the "Logout" option in the burger menu to log out of the application.
   */
  async clickOnLogoutMenu(): Promise<void> {
      // Ensure the "Logout" menu option is visible before clicking
      await expect(this.burgerMenuLogout).toBeVisible();
      await this.burgerMenuLogout.click();
  }

  /**
   * Clicks on the "Reset App State" option in the burger menu.
   */
  async clickOnReset(): Promise<void> {
      // Ensure the "Reset" menu option is visible before clicking
      await expect(this.burgerMenuReset).toBeVisible();
      await this.burgerMenuReset.click();
  }

  /**
   * Verifies the footer section and its elements, including social media links, footer text, and robot image.
   */
  async verifyFooter(): Promise<void> {
      // Verify the footer section and its elements are visible
      await expect.soft(this.footer).toBeVisible();
      await expect.soft(this.socialTwitter).toBeVisible(); // Twitter icon
      await expect.soft(this.socialFacebook).toBeVisible(); // Facebook icon
      await expect.soft(this.socialLinkedIn).toBeVisible(); // LinkedIn icon
      await expect.soft(this.footerCopy).toBeVisible(); // Footer copy text

      // Verify the footer copy text matches the expected value from translations
      await expect.soft(this.footerCopy).toHaveText(this.translations.footer.footerCopyText);

      // Verify the visibility and source of the robot image in the footer
      await expect.soft(this.footerRobot).toBeVisible();
      await expect.soft(this.footerRobot).toHaveAttribute('src', shared.footer.footerRobotSrc);
  }
}