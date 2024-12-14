import { test } from '@playwright/test'
import { InventoryPage } from '../pages/InventoryPage.ts'
import { LoginPage } from '../pages/LoginPage.ts'
import { CartPage } from '../pages/CartPage.ts';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage.ts';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage.ts';
import { CompletePage } from '../pages/CompletePage.ts';
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


test.describe('Checkout Scenarios', () => {
  test(`Proceed to checkout`, async ({ page }) => {
    const inventory = new InventoryPage(page,locale);
    const cart = new CartPage(page,locale);
    const checkoutInfo = new CheckoutInfoPage(page,locale);

    const addedItems = [translations.inventory[0].name, translations.inventory[1].name,translations.inventory[2].name];

    await test.step(`Given I have items in my cart`, async () => {
      await inventory.verifyDefaultInventoryPage();
      for (let i = 0; i< addedItems.length; i++){
        await inventory.addItemToCart(addedItems[i]);
      }
      await inventory.verifyCartCount(addedItems.length);
      await inventory.clickOnCartIcon();
      await cart.verifyCartPage(addedItems.length);
      await cart.validateCartItems(addedItems);
    });

    await test.step(`When I click the "${shared.buttons.checkoutBtnText}" button`, async () => {
      await cart.proceedToCheckout();
    });

    await test.step('Then I should be redirected to the checkout information page', async () => {
      await checkoutInfo.verifyCheckoutInfoPage(addedItems.length);
    });
  });

  test(`User leaves all fields blank on "Checkout: Your Information" page`, async ({ page }) => {
    const inventory = new InventoryPage(page,locale);
    const cart = new CartPage(page,locale);
    const checkoutInfo = new CheckoutInfoPage(page,locale);

    const addedItems = [translations.inventory[3].name, translations.inventory[4].name,translations.inventory[5].name ]

    await test.step(`Given I am on the "${translations.headers.checkoutInfo}" page`, async () => {
      await inventory.verifyDefaultInventoryPage();
      for (let i = 0; i< addedItems.length; i++){
        await inventory.addItemToCart(addedItems[i]);
      }
      await inventory.verifyCartCount(addedItems.length);
      await inventory.clickOnCartIcon();
      await cart.verifyCartPage(addedItems.length);
      await cart.validateCartItems(addedItems);
      await cart.proceedToCheckout();
    });

    await test.step(`When I leave the all fields blank`, async () => {
      await checkoutInfo.verifyCheckoutInfoPage(addedItems.length);
    });

    await test.step(`And I click the "${translations.headers.checkoutInfo}" button`, async () => {
      await checkoutInfo.clickOnContinue();
    });

    await test.step(`Then I should see an error message "${translations.errorMessages.yourInfoFirstNameErrorMessage}"`, async () => {
      await checkoutInfo.verifyErrorMessage(translations.errorMessages.yourInfoFirstNameErrorMessage);
    });
  });

  test(`User completes an order`, async ({ page }) => {
    const inventory = new InventoryPage(page,locale);
    const cart = new CartPage(page,locale);
    const checkoutInfo = new CheckoutInfoPage(page,locale);
    const checkoutOverview = new CheckoutOverviewPage(page,locale);
    const complete = new CompletePage(page,locale);

    const addedItems = [translations.inventory[0].name, translations.inventory[1].name,translations.inventory[2].name, translations.inventory[3].name, translations.inventory[4].name,translations.inventory[5].name ]

    await test.step(`Given I am on the checkout overview page`, async () => {
      await inventory.verifyDefaultInventoryPage();
      for (let i = 0; i< addedItems.length; i++){
        await inventory.addItemToCart(addedItems[i]);
      }
      await inventory.verifyCartCount(addedItems.length);
      await inventory.clickOnCartIcon();
      
      // Cart Page
      await cart.verifyCartPage(addedItems.length);
      await cart.validateCartItems(addedItems);
      await cart.proceedToCheckout();

      // Checkout: Your Information Page
      await checkoutInfo.verifyCheckoutInfoPage(addedItems.length);
      await checkoutInfo.enterFirstName(translations.checkoutInfo.firstName);
      await checkoutInfo.enterLastName(translations.checkoutInfo.lastName);
      await checkoutInfo.enterZip(translations.checkoutInfo.zip);
      await checkoutInfo.clickOnContinue();

      // Checkout: Overview Page
      await checkoutOverview.verifyCheckoutOverviewPage(addedItems.length);
      await checkoutOverview.verifyItems(addedItems);
      await checkoutOverview.verifyPaymentInformation(shared.checkoutInfo.paymentInfo);
      await checkoutOverview.verifyShippingInformation(translations.checkoutInfo.shippingInfo);
      await checkoutOverview.verifyItemTotal(addedItems);
      await checkoutOverview.verifyTax();
      await checkoutOverview.verifyTotal();
    });

    await test.step(`When I click the "${translations.buttons.finishBtnText}" button`, async () => {
      await checkoutOverview.clickOnFinish();
    });

    await test.step(`Then I should be redirected to the confirmation order page where you can see the message "${translations.general.thankYouText}" and "${translations.general.orderText}"`, async () => {
      await complete.verifyRedirectionToCompletePage();
    });

  });
});