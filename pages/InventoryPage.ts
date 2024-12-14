import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage.ts';
import { InventoryItem } from '../types/translations.ts';

/**
 * Inventory page class to handle interactions and verifications for the inventory page
 */
export class InventoryPage extends BasePage {
    readonly headerSecondaryContainer: Locator;
    readonly peekRobot: Locator;
    readonly productLabel: Locator;
    readonly productSortContainer: Locator;
    readonly inventoryList: Locator;
    readonly inventoryItems: Locator;
    readonly inventoryItemsImg: Locator;
    readonly inventoryItemsName: Locator;
    readonly inventoryItemsDescription: Locator;
    readonly inventoryItemsPrice: Locator;
    readonly inventoryItemsAddToCart: Locator;
    readonly inventoryItemsRemoveFromCart: Locator;

    constructor(page: Page, locale: string) {
        super(page, locale);

        // Initialize locators for inventory page elements
        this.headerSecondaryContainer = page.locator('.header_secondary_container');
        this.peekRobot = page.locator('.peek');
        this.productLabel = page.locator('.product_label');
        this.productSortContainer = page.locator('.product_sort_container');
        this.inventoryList = page.locator('#inventory_container .inventory_list');
        this.inventoryItems = this.inventoryList.locator('.inventory_item');
        this.inventoryItemsImg = page.locator('img.inventory_item_img');
        this.inventoryItemsName = this.inventoryItems.locator('.inventory_item_label .inventory_item_name');
        this.inventoryItemsDescription = this.inventoryItems.locator('.inventory_item_label .inventory_item_desc');
        this.inventoryItemsPrice = this.inventoryItems.locator('.pricebar .inventory_item_price');
        this.inventoryItemsAddToCart = page.locator('.btn_primary.btn_inventory');
        this.inventoryItemsRemoveFromCart = this.inventoryItems.locator('.btn_secondary.btn_inventory');
    }

    /**
     * Verifies successful navigation to the inventory page.
     */
    async verifyRedirectionToInventoryPage(): Promise<void> {
        await this.page.waitForURL('**/v1/inventory.html');
        await expect(this.inventoryList).toBeVisible();
    }

    /**
     * Sorts the inventory items based on the given sorting criteria.
     * @param labelValue - Sorting criteria ('az', 'za', 'lowhigh', 'highlow').
     * @returns A sorted array of inventory items.
     */
    async sortInventory(labelValue: string): Promise<InventoryItem[]> {
        const inventoryData = this.translations.inventory;
        const sortedData = [...inventoryData];

        switch (labelValue) {
            case this.translations.sortOptions.az:
                sortedData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case this.translations.sortOptions.za:
                sortedData.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case this.translations.sortOptions.lowhigh:
                sortedData.sort((a, b) => parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1)));
                break;
            case this.translations.sortOptions.highlow:
                sortedData.sort((a, b) => parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1)));
                break;
        }

        return sortedData;
    }

    /**
     * Verifies that the items on the inventory page match the expected sorted order.
     * @param sortedOrder - The sorting order to validate against.
     */
    async verifyItemsOnList(sortedOrder: string): Promise<void> {
        await expect(this.inventoryList).toBeVisible();

        const itemCount = await this.inventoryItems.count();
        expect(itemCount).toBe(this.translations.inventory.length);

        const sortedItems = await this.sortInventory(sortedOrder);

        for (let i = 0; i < itemCount; i++) {
            // Verify item details
            await expect(this.inventoryItemsName.nth(i)).toHaveText(sortedItems[i].name);
            await expect(this.inventoryItemsDescription.nth(i)).toHaveText(sortedItems[i].description);
            await expect(this.inventoryItemsPrice.nth(i)).toHaveText(sortedItems[i].price);

            // Verify price format based on currency
            const currencySymbol = this.translations.general.currencySymbol;
            const priceRegex = currencySymbol === "$" ? /^\$\d+\.\d{2}$/ : /^\€\d+\.\d{2}$/;
            expect(await this.inventoryItemsPrice.nth(i).textContent()).toMatch(priceRegex);

            // Verify image source
            await expect(this.inventoryItemsImg.nth(i)).toHaveAttribute("src", sortedItems[i].img);

            // Verify add-to-cart button text
            await expect(this.inventoryItemsAddToCart.nth(i)).toHaveText(this.translations.buttons.addToCartBtnText);
        }
    }

    /**
     * Verifies the default state of the inventory page, including header, sorting options, and item list.
     * @param cartCount - Number of items in the cart.
     */
    async verifyDefaultInventoryPage(cartCount: number = 0): Promise<void> {
        await this.verifyPageHeader(cartCount);

        // Verify header elements
        await expect.soft(this.peekRobot).toBeVisible();
        await expect.soft(this.productLabel).toHaveText(this.translations.headers.products);
        await expect.soft(this.productSortContainer).toBeVisible();
        expect.soft(await this.productSortContainer.locator('option:checked').textContent()).toBe(this.translations.sortOptions.az);

        // Verify sorting options
        const sortOptions = Object.values(this.translations.sortOptions);
        const actualSortOptions = await this.productSortContainer.locator('option').allTextContents();
        expect.soft(actualSortOptions).toEqual(sortOptions);

        // Verify items
        await this.verifyItemsOnList(this.translations.sortOptions.az);

        // Verify footer
        await this.verifyFooter();
    }

    /**
     * Selects a sorting option from the dropdown.
     * @param labelValue - The sorting label to select.
     */
    async selectProductSort(labelValue: string): Promise<void> {
        await this.productSortContainer.selectOption({ label: labelValue });
    }

    /**
     * Opens the details page for a specific inventory item.
     * @param itemName - Name of the item to open.
     */
    async openItemDetailsPage(itemName: string): Promise<void> {
        await this.inventoryItemsName.getByText(itemName).click();
    }

    /**
     * Adds a specific item to the cart.
     * @param name - Name of the item to add to the cart.
     */
    async addItemToCart(itemName: string): Promise<void> {
        const titles = await this.inventoryItemsName.allTextContents();
        const itemIndex = titles.findIndex(title => title.trim() === itemName);
        await this.inventoryItemsAddToCart.nth(itemIndex).click();
    }

    /**
     * Adds multiple items to the cart.
     * @param itemNames - Array of item names to add to the cart.
     */
    async addItemsToCart(itemNames: string[]): Promise<void> {
        const titles = await this.inventoryItemsName.allTextContents();
        for (const name of itemNames) {
            const itemIndex = titles.findIndex(title => title.trim() === name);
            await this.inventoryItemsAddToCart.nth(itemIndex).click();
        }
    }

    /**
     * Removes a specific item from the cart.
     * @param itemName - Name of the item to remove.
     */
    async removeItemFromCart(itemName: string): Promise<void> {
        const titles = await this.inventoryItemsName.allTextContents();
        const itemIndex = titles.findIndex(title => title.trim() === itemName);
        await this.inventoryItemsRemoveFromCart.nth(itemIndex).click();
    }

    /**
     * Verifies that the remove button is visible for a specific item.
     * @param itemName - Name of the item to check.
     */
    async verifyRemoveIsVisible(itemName: string): Promise<void> {
        const titles = await this.inventoryItemsName.allTextContents();
        const itemIndex = titles.findIndex(title => title.trim() === itemName);
        await expect(this.inventoryItemsRemoveFromCart.nth(itemIndex)).toBeVisible();
    }
}