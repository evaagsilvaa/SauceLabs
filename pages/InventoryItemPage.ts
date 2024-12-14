import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { InventoryItem } from '../types/translations.ts';

/**
 * The InventoryItemPage class encapsulates locators and methods for interacting with the Inventory Item Details page.
 */
export class InventoryItemPage extends BasePage {
  readonly headerLabel: Locator;
  readonly backBtn: Locator;
  readonly itemImg: Locator;
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly addToCartBtn: Locator;
  readonly removeBtn: Locator;

  /**
   * Initializes the InventoryItemPage with a Playwright `Page` object and locale for translations.
   * @param page - The Playwright `Page` instance.
   * @param locale - The locale code used to load translations.
   */
  constructor(page: Page, locale: string) {
    super(page, locale);

    // Initialize locators for elements on the Inventory Item Details page
    this.headerLabel = page.locator('.header_label');
    this.backBtn = page.locator('.inventory_details_back_button');
    this.itemImg = page.locator('.inventory_details_img');
    this.itemName = page.locator('.inventory_details_name');
    this.itemDescription = page.locator('.inventory_details_desc');
    this.itemPrice = page.locator('.inventory_details_price');
    this.addToCartBtn = page.locator('.btn_primary');
    this.removeBtn = page.locator('.btn_secondary');
  }

  /**
   * Clicks on the 'Add to Cart' button.
   */
  async clickOnAddToCart(): Promise<void> {
    // Ensure the "Add to Cart" button is visible before interaction
    await expect(this.addToCartBtn).toBeVisible();
    await this.addToCartBtn.click();
  }

  /**
   * Clicks on the 'Remove' button.
   */
  async clickOnRemove(): Promise<void> {
    // Ensure the "Remove" button is visible before interaction
    await this.verifyRemoveBtnIsVisible();
    await this.removeBtn.click();
  }

  /**
   * Verifies the visibility and text of the 'Remove' button.
   */
  async verifyRemoveBtnIsVisible(): Promise<void> {
    await expect(this.removeBtn).toBeVisible();
    await expect(this.removeBtn).toHaveText(this.translations.buttons.removeBtnText);
  }

  /**
   * Clicks on the 'Back' button to navigate to the previous page.
   */
  async clickOnBack(): Promise<void> {
    // Ensure the "Back" button is visible before interaction' button
    await expect(this.backBtn).toBeVisible();
    await this.backBtn.click();
  }

  /**
   * Verifies the details of the Inventory Item Details page.
   *
   * @param itemName - The name of the item to verify details for.
   * @param addToCart - Indicates whether the 'Add to Cart' button should be displayed. Defaults to `true`.
   * @param cartCount - The number of items in the cart. Defaults to `0`.
   */
  async verifyItemPage(itemName: string, addToCart: boolean = true, cartCount: number = 0): Promise<void> {
    // ------------ Verify Page Header ---------- //
    await this.verifyPageHeader(cartCount);

    // ------------ Verify Item Info ---------- //
    const inventory_data: InventoryItem[] = this.translations.inventory;
    const itemInfo = inventory_data.find(item => item.name === itemName)!;

    // Verify the item's name (visibility and text)
    await expect(this.itemName).toBeVisible();
    await expect.soft(this.itemName).toHaveText(itemInfo.name);

    // Verify the item's description (visibility and text)
    await expect(this.itemDescription).toBeVisible();
    await expect.soft(this.itemDescription).toHaveText(itemInfo.description);

    // Verify the item's price (visibility and text format)
    await expect(this.itemPrice).toBeVisible();
    await expect.soft(this.itemPrice).toHaveText(itemInfo.price);
    const currencySymbol = this.translations.general.currencySymbol;
    if (currencySymbol === "$") {
      expect.soft(await this.itemPrice.textContent()).toMatch(/^\$\d+\.\d{2}$/); // Ensure the price is in "$xx.xx" format
    } else if (currencySymbol === "€") {
      expect.soft(await this.itemPrice.textContent()).toMatch(/^\€\d+\.\d{2}$/); // Ensure the price is in "€xx.xx" format
    }

    // Verify the item's image (visibility and source)
    await expect(this.itemImg).toBeVisible();
    await expect.soft(this.itemImg).toHaveAttribute("src", itemInfo.img);

    // Verify the 'Add to Cart' or 'Remove' button based on the `addToCart` parameter
    if (addToCart) {
      await expect(this.addToCartBtn).toBeVisible();
      await expect.soft(this.addToCartBtn).toHaveText(this.translations.buttons.addToCartBtnText);
    } else {
      await expect(this.removeBtn).toBeVisible();
      await expect.soft(this.removeBtn).toHaveText(this.translations.buttons.removeBtnText);
    }

    // Verify the 'Back' button (visibility and text)
    await expect(this.backBtn).toBeVisible();
    await expect.soft(this.backBtn).toHaveText(this.translations.buttons.backBtnText);

    // -------- Verify Footer --------- //
    await this.verifyFooter();
  }
}