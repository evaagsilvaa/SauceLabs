import { test } from '@playwright/test'
import { InventoryPage } from '../pages/InventoryPage.ts'
import { LoginPage } from '../pages/LoginPage.ts'
import { loadTranslations } from '../utils/translationsHelper.ts';
import shared from '../locales/shared.json';

let translations: any;
let locale: string;

const standardUser = shared.credentials.loginCredentials.find(
  (cred) => cred.username === 'standard_user'
)!;

test.beforeEach('Open Login page', async ({ page }, testInfo) => {
  // Access the project name using `testInfo.project.name`
  locale = testInfo.project.name === 'English' ? 'en' : 'pt';
  
  // Load the translations for the specific locale
  translations = loadTranslations(locale);

  const login = new LoginPage(page);
  //Open Swag Labs > Login Page
  await login.navLogin();
});

test.describe('@login Login Scenarios', () => {
  test(`Valid Login > Username: ${standardUser.username}`, async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page,locale);

    await test.step('Given I am on the login page', async () => {
      await login.verifyLoginPage();
    });

    await test.step(`When I enter the username "${standardUser.username}"`, async () => {
      await login.enterUsername(standardUser?.username);
    });

    await test.step(`And I enter the password "${standardUser.password}"`, async () => {
      await login.enterPassword(standardUser.password);
    });

    await test.step(`And I click the "${shared.buttons.loginBtnText}" button`, async () => {
        await login.clickOnLoginBtn();
    });

    await test.step('Then I should be redirected to the Products page', async () => {
      await inventory.verifyRedirectionToInventoryPage();
    });
  });

  test('Invalid login with incorrect credentials', async ({ page }) => {
    const login = new LoginPage(page);

    await test.step('Given I am on the login page', async () => {
      await login.verifyLoginPage();
    });

    await test.step(`When I enter the username "${shared.credentials.invalidUsername}"`, async () => {
      await login.enterUsername(shared.credentials.invalidUsername);
    });

    await test.step(`And I enter the password "${shared.credentials.invalidPassword}"`, async () => {
      await login.enterPassword(shared.credentials.invalidPassword);
    });

    await test.step(`And I click the "${shared.buttons.loginBtnText}" button`, async () => {
        await login.clickOnLoginBtn();
    });

    await test.step(`Then I should see an error message "${translations.errorMessages.loginErrorMessageDontMatch}"`, async () => {
        await login.verifyErrorMessage(translations.errorMessages.loginErrorMessageDontMatch);
    });  
  });
  });
