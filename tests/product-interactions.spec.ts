import { test } from '@playwright/test'
import { InventoryPage } from '../pages/InventoryPage.ts'
import { InventoryItemPage } from '../pages/InventoryItemPage.ts'
import { LoginPage } from '../pages/LoginPage.ts'
import { CartPage } from '../pages/CartPage.ts';
import { loadTranslations } from '../utils/translationsHelper.ts';
import shared from '../locales/shared.json';

let translations: any;
let locale: string;

const standardUser = shared.credentials.loginCredentials.find(
  (cred) => cred.username === 'standard_user'
)!;

test.beforeEach('I log in as a standard user', async ({ page }, testInfo) => {
  // Access the project name using `testInfo.project.name`
  locale = testInfo.project.name === 'English' ? 'en' : 'pt'; // Default to 'fr' for any non-English project
  
  // Load the translations for the specific locale
  translations = loadTranslations(locale);

  const login = new LoginPage(page);
  await login.navLogin();
  await login.enterLoginCredentials(standardUser.username, standardUser.password);
  await login.clickOnLoginBtn();
});


test.describe('Product Interaction Scenarios', () => {
  test(`User adds a product to the cart`, async ({ page }) => {
    const inventory = new InventoryPage(page,locale);

    const addItem = translations.inventory[0].name;

    await test.step('Given I am on the Products page', async () => {
      await inventory.verifyDefaultInventoryPage();
    });

    await test.step(`When I click the "${translations.buttons.addToCartBtnText}" button for "${addItem}"`, async () => {
      await inventory.addItemToCart(addItem);
    });

    await test.step('Then the cart icon should display "1"', async () => {
      await inventory.verifyCartCount(1);
    });

    await test.step(`And the "REMOVE" button should appear for "${addItem}"`, async () => {
      await inventory.verifyRemoveIsVisible(addItem);
    });
  });

  test(`User removes a product from the cart`, async ({ page }) => {
    const inventory = new InventoryPage(page, locale);
    const cart = new CartPage(page, locale);

    const addItem = translations.inventory[0].name;

    await test.step(`Given I have "${addItem}" in my cart`, async () => {
      await inventory.verifyDefaultInventoryPage();
      await inventory.addItemToCart(addItem);
    });

    await test.step(`When I click the "${translations.buttons.removeBtnText}" button for "${addItem}"`, async () => {
      await inventory.removeItemFromCart(addItem);
    });

    await test.step("Then the cart icon shouldn't display any number", async () => {
      await inventory.verifyCartCount(0);
    });

    await test.step('And the product should no longer be in my cart', async () => {
      await inventory.clickOnCartIcon();
      await cart.validateCartItems();
    });
  });

  test(`Sorts products by price (low to high)`, async ({ page }) => {
    const inventory = new InventoryPage(page, locale);

    await test.step(`Given I am on the Products page`, async () => {
      await inventory.verifyDefaultInventoryPage();
    });

    await test.step(`When I select "${translations.sortOptions.lowhigh}" from the sort dropdown`, async () => {
      await inventory.selectProductSort(translations.sortOptions.lowhigh);
    });

    await test.step("Then the products should be sorted in ascending order of price", async () => {
      await inventory.verifyItemsOnList(translations.sortOptions.lowhigh);
    });
  });   

  test(`User navigates to the product detail page by clicking on the product name`, async ({ page }) => {
    const inventory = new InventoryPage(page, locale);
    const inventoryItem = new InventoryItemPage(page, locale);

    const addItem = translations.inventory[0].name;

    await test.step(`Given I am on the Products page`, async () => {
      await inventory.verifyDefaultInventoryPage();
    });

    await test.step(`When I click on the name of the "${addItem}"`, async () => {
      await inventory.openItemDetailsPage(addItem);
    });

    await test.step(`Then I should be redirected to the product detail page for "${addItem}"`, async () => {
      await inventoryItem.verifyItemPage(addItem);
    });
  }); 

  test(`Adding a product to the cart from the product detail page`, async ({ page }) => {
    const inventory = new InventoryPage(page, locale);
    const inventoryItem = new InventoryItemPage(page, locale);

    const addItem = translations.inventory[0].name;

    await test.step(`Given I am on the product detail page for "${addItem}"`, async () => {
      await inventory.verifyDefaultInventoryPage();
      await inventory.openItemDetailsPage(addItem);
      await inventoryItem.verifyItemPage(addItem);
    });

    await test.step(`When I click the "${translations.buttons.addToCartBtnText}" button`, async () => {
      await inventoryItem.clickOnAddToCart();
    });

    await test.step(`Then the button text should change to "${translations.buttons.removeBtnText}"`, async () => {
      await inventoryItem.verifyRemoveBtnIsVisible();
    });

    await test.step(`And the cart icon in the header should show "1"`, async () => {
      await inventoryItem.verifyCartCount(1);
    });
  }); 
});