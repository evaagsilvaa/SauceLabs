import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import shared from '../locales/shared.json';
import { InventoryItem } from '../types/translations';

/**
 * Represents the Cart page, extending the BasePage to include functionality
 * specific to the shopping cart, such as validating cart items and interacting with buttons.
 */
export class CartPage extends BasePage {
  private readonly subHeaderLocator: Locator;
  private readonly qtyColumnLocator: Locator;
  private readonly descColumnLocator: Locator;
  private readonly cartItemsLocator: Locator;
  private readonly itemQuantityLocator: Locator;
  private readonly itemNameLocator: Locator;
  private readonly itemDescriptionLocator: Locator;
  private readonly itemPriceLocator: Locator;
  private readonly itemRemoveBtnLocator: Locator;
  private readonly continueShoppingBtnLocator: Locator;
  private readonly checkoutBtnLocator: Locator;

  /**
   * Initializes the CartPage with a Playwright `Page` object and locale for translations.
   * @param page - The Playwright `Page` instance.
   * @param locale - The locale code used to load translations.
   */
  constructor(page: Page, locale: string) {
      super(page, locale);

      // Initialize locators for cart page elements
      this.subHeaderLocator = page.locator('.subheader');
      this.qtyColumnLocator = page.locator('.cart_quantity_label');
      this.descColumnLocator = page.locator('.cart_desc_label');
      this.cartItemsLocator = page.locator('.cart_item');
      this.itemQuantityLocator = page.locator('.cart_quantity');
      this.itemNameLocator = page.locator('.inventory_item_name');
      this.itemDescriptionLocator = page.locator('.inventory_item_desc');
      this.itemPriceLocator = page.locator('.inventory_item_price');
      this.itemRemoveBtnLocator = page.locator('.btn_secondary.cart_button');
      this.continueShoppingBtnLocator = page.locator('//a[@class="btn_secondary" and @href="./inventory.html"]');
      this.checkoutBtnLocator = page.locator('.checkout_button');
  }

  /**
   * Validates the cart items by checking their name, description, price, and quantity
   * against the provided expected items.
   * @param expectedItems - An optional array of item names expected to be in the cart.
   */
  async validateCartItems(expectedItems?: string[]): Promise<void> {
      const itemCount = await this.cartItemsLocator.count();

      if (expectedItems) {
          for (const [index, name] of expectedItems.entries()) {
              const inventoryData: InventoryItem[] = this.translations.inventory;

              // Find the item data from the translations based on the item name
              const itemData = inventoryData.find(item => item.name === name)!;

              const itemLocator = this.cartItemsLocator.nth(index);

              // Verify item details (name, description, price, quantity)
              await expect(itemLocator.locator(this.itemNameLocator)).toHaveText(itemData.name);
              await expect.soft(itemLocator.locator(this.itemDescriptionLocator)).toHaveText(itemData.description);
              await expect.soft(itemLocator.locator(this.itemPriceLocator)).toHaveText(itemData.price);
              await expect.soft(itemLocator.locator(this.itemQuantityLocator)).toHaveText("1");
          }
      } else {
          // Assert that the cart is empty if no expected items are provided
          expect(itemCount).toBe(0);
      }
  }

  /**
   * Verifies the Cart page, including headers, fields, buttons, and footer elements.
   * @param cartCount - The expected number of items in the shopping cart.
   */
  async verifyCartPage(cartCount: number): Promise<void> {
      // ------------ Verify Page Header ------------ //
      await this.verifyPageHeader(cartCount);

      // ------------ Verify Subheader ------------ //
      await expect.soft(this.subHeaderLocator).toBeVisible(); // Verify subheader visibility
      await expect.soft(this.subHeaderLocator).toHaveText(this.translations.headers.yourCart); // Verify subheader text

      // ------------ Verify Columns ------------ //
      await expect.soft(this.qtyColumnLocator).toBeVisible(); // Verify quantity column visibility
      await expect.soft(this.qtyColumnLocator).toHaveText(this.translations.general.qtyText); // Verify quantity column text

      await expect.soft(this.descColumnLocator).toBeVisible(); // Verify description column visibility
      await expect.soft(this.descColumnLocator).toHaveText(this.translations.general.descText); // Verify description column text

      // ------------ Verify Buttons ------------ //
      await expect(this.continueShoppingBtnLocator).toBeVisible(); // Verify "Continue Shopping" button visibility
      await expect.soft(this.continueShoppingBtnLocator).toHaveText(this.translations.buttons.continueShoppingBtnText); // Verify "Continue Shopping" button text

      await expect(this.checkoutBtnLocator).toBeVisible(); // Verify "Checkout" button visibility
      await expect.soft(this.checkoutBtnLocator).toHaveText(shared.buttons.checkoutBtnText); // Verify "Checkout" button text

      // ------------ Verify Footer ------------ //
      await this.verifyFooter();
  }

  /**
   * Clicks the 'Continue Shopping' button to navigate back to the inventory page.
   */
  async clickOnContinueShopping(): Promise<void> {
      // Ensure the "Continue Shopping" button is visible before interaction
      await expect(this.continueShoppingBtnLocator).toBeVisible();
      await this.continueShoppingBtnLocator.click();
  }

  /**
   * Clicks the 'Checkout' button to proceed to the checkout page.
   */
  async proceedToCheckout(): Promise<void> {
      // Ensure the "Checkout" button is visible before interaction
      await expect(this.checkoutBtnLocator).toBeVisible();
      await this.checkoutBtnLocator.click();
  }
}