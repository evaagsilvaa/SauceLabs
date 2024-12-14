import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { InventoryItem } from '../types/translations';

/**
 * Represents the Checkout Overview page, extending the BasePage to include 
 * functionality for verifying checkout items, payment/shipping details, and totals.
 */
export class CheckoutOverviewPage extends BasePage {
    private readonly subHeaderLocator: Locator;
    private readonly qtyColumnLocator: Locator;
    private readonly descColumnLocator: Locator;
    private readonly cartItemsLocator: Locator;
    private readonly itemNameLocator: Locator;
    private readonly itemDescriptionLocator: Locator;
    private readonly itemPriceLocator: Locator;
    private readonly itemQuantityLocator: Locator;
    private readonly paymentInfoSectionLocator: Locator;
    private readonly paymentInfoLocator: Locator;
    private readonly shippingInfoSectionLocator: Locator;
    private readonly shippingInfoLocator: Locator;
    private readonly itemTotalLocator: Locator;
    private readonly taxLocator: Locator;
    private readonly totalLocator: Locator;
    private readonly finishBtnLocator: Locator;
    private readonly cancelBtnLocator: Locator;

    /**
     * Initializes the CheckoutOverviewPage with a Playwright `Page` object and locale for translations.
     * @param page - The Playwright `Page` instance.
     * @param locale - The locale code used to load translations.
     */
    constructor(page: Page, locale: string) {
        super(page, locale);

        // Initialize locators for various elements on the Checkout Overview page
        this.subHeaderLocator = page.locator('.subheader');
        this.qtyColumnLocator = page.locator('.cart_quantity_label');
        this.descColumnLocator = page.locator('.cart_desc_label');
        this.cartItemsLocator = page.locator('.cart_item');
        this.itemNameLocator = page.locator('.inventory_item_name');
        this.itemDescriptionLocator = page.locator('.inventory_item_desc');
        this.itemPriceLocator = page.locator('.inventory_item_price');
        this.itemQuantityLocator = page.locator('.summary_quantity');
        this.paymentInfoSectionLocator = page.locator('(//*[@class="summary_info_label"])[1]');
        this.paymentInfoLocator = page.locator('(//*[@class="summary_value_label"])[1]');
        this.shippingInfoSectionLocator = page.locator('(//*[@class="summary_info_label"])[2]');
        this.shippingInfoLocator = page.locator('(//*[@class="summary_value_label"])[2]');
        this.itemTotalLocator = page.locator('.summary_subtotal_label');
        this.taxLocator = page.locator('.summary_tax_label');
        this.totalLocator = page.locator('.summary_total_label');
        this.finishBtnLocator = page.locator('.cart_button');
        this.cancelBtnLocator = page.locator('.cart_cancel_link');
    }

    /**
     * Verifies the Checkout Overview page by validating the header, columns, sections, and buttons.
     * @param cartCount - The expected number of items in the shopping cart.
     */
    async verifyCheckoutOverviewPage(cartCount: number): Promise<void> {
        // Verify the main page header
        await this.verifyPageHeader(cartCount);

        // Verify the secondary header text and visibility
        await expect.soft(this.subHeaderLocator).toBeVisible();
        await expect.soft(this.subHeaderLocator).toHaveText(this.translations.headers.checkoutOverview);

        // Verify the column headers for quantity and description
        await expect.soft(this.qtyColumnLocator).toBeVisible();
        await expect.soft(this.qtyColumnLocator).toHaveText(this.translations.general.qtyText);
        await expect.soft(this.descColumnLocator).toBeVisible();
        await expect.soft(this.descColumnLocator).toHaveText(this.translations.general.descText);

        // Verify the payment information section
        await expect.soft(this.paymentInfoSectionLocator).toBeVisible();
        await expect.soft(this.paymentInfoSectionLocator).toHaveText(this.translations.checkoutInfo.paymentInfoSection);

        // Verify the shipping information section
        await expect.soft(this.shippingInfoSectionLocator).toBeVisible();
        await expect.soft(this.shippingInfoSectionLocator).toHaveText(this.translations.checkoutInfo.shippingInfoSection);

        // Verify buttons' visibility and text
        await expect(this.cancelBtnLocator).toBeVisible();
        await expect.soft(this.cancelBtnLocator).toHaveText(this.translations.buttons.cancelBtnText);
        await expect(this.finishBtnLocator).toBeVisible();
        await expect.soft(this.finishBtnLocator).toHaveText(this.translations.buttons.finishBtnText);

        // Verify the footer section
        await this.verifyFooter();
    }

    /**
     * Verifies that the items in the cart match the expected items.
     * @param expectedItems - An array of expected item names.
     */
    async verifyItems(expectedItems: string[]): Promise<void> {
        for (const [index, name] of expectedItems.entries()) {
            // Retrieve item data from translations using its name
            const inventoryData: InventoryItem[] = this.translations.inventory;
            const itemData = inventoryData.find(item => item.name === name)!;

            // Locate the item in the cart and verify its details
            const itemLocator = this.cartItemsLocator.nth(index);
            await expect(itemLocator.locator(this.itemNameLocator)).toHaveText(itemData.name);
            await expect(itemLocator.locator(this.itemDescriptionLocator)).toHaveText(itemData.description);
            await expect(itemLocator.locator(this.itemPriceLocator)).toHaveText(itemData.price);
            await expect(itemLocator.locator(this.itemQuantityLocator)).toHaveText("1");
        }
    }

    /**
     * Verifies that the displayed payment information matches the expected value.
     * @param expectedPaymentInfo - The expected payment information.
     */
    async verifyPaymentInformation(expectedPaymentInfo: string): Promise<void> {
        await expect(this.paymentInfoLocator).toHaveText(expectedPaymentInfo);
    }

    /**
     * Verifies that the displayed shipping information matches the expected value.
     * @param expectedShippingInfo - The expected shipping information.
     */
    async verifyShippingInformation(expectedShippingInfo: string): Promise<void> {
        await expect(this.shippingInfoLocator).toHaveText(expectedShippingInfo);
    }

    /**
     * Verifies the total item price displayed on the page by summing individual item prices.
     * @param expectedItems - An array of expected item names.
     */
    async verifyItemTotal(expectedItems: string[]): Promise<void> {
        let itemTotal = 0;

        for (const [index, name] of expectedItems.entries()) {
            // Retrieve item data and price
            const inventoryData: InventoryItem[] = this.translations.inventory;
            const itemData = inventoryData.find(item => item.name === name)!;

            const itemLocator = this.cartItemsLocator.nth(index);
            const priceText = await itemLocator.locator(this.itemPriceLocator).textContent();
            if (!priceText) throw new Error(`Price text not found for item "${name}"`);

            // Parse the price text and add to the total
            const itemPrice = parseFloat(priceText.replace(this.translations.general.currencySymbol, ''));
            itemTotal += itemPrice;
        }

        // Validate the total displayed on the page
        await expect(this.itemTotalLocator).toHaveText(`Item total: ${this.translations.general.currencySymbol}${itemTotal.toFixed(2)}`);
    }

    /**
     * Verifies that the displayed tax matches the expected format and symbol.
     */
    async verifyTax(): Promise<void> {
        const currencySymbol = this.translations.general.currencySymbol;
        if (currencySymbol === "$") {
            expect(await this.taxLocator.textContent()).toMatch(/^Tax: \$\d+\.\d{2}$/);
        } else if (currencySymbol === "€") {
            expect(await this.taxLocator.textContent()).toMatch(/^Tax: \€\d+\.\d{2}$/);
        }
    }

    /**
     * Verifies that the total amount (item total + tax) matches the expected value.
     */
    async verifyTotal(): Promise<void> {
        let itemTotal = 0;

        // Extract and parse the item total
        const itemTotalText = await this.itemTotalLocator.textContent();
        if (itemTotalText) {
            itemTotal += parseFloat(itemTotalText.replace(`Item total: ${this.translations.general.currencySymbol}`, ''));
        }

        // Extract and parse the tax
        const taxText = await this.taxLocator.textContent();
        if (taxText) {
            itemTotal += parseFloat(taxText.replace(`Tax: ${this.translations.general.currencySymbol}`, ''));
        }

        // Validate the total displayed on the page
        await expect(this.totalLocator).toHaveText(`Total: ${this.translations.general.currencySymbol}${itemTotal.toFixed(2)}`);
    }

    /**
     * Clicks the 'Cancel' button to navigate back to the previous page.
     */
    async clickOnCancel(): Promise<void> {
        await expect(this.cancelBtnLocator).toBeVisible();
        await this.cancelBtnLocator.click();
    }

    /**
     * Clicks the 'Finish' button to complete the checkout process.
     */
    async clickOnFinish(): Promise<void> {
        await expect(this.finishBtnLocator).toBeVisible();
        await this.finishBtnLocator.click();
    }
}