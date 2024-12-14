import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 5 * 60 * 1000,
  fullyParallel: true,                          /* Run tests in files in parallel */
  forbidOnly: !!process.env.CI,                 /* Fail the build on CI if you accidentally left test.only in the source code. */
  retries: process.env.CI ? 2 : 0,              /* Retry on CI only */
  workers: process.env.CI ? 1 : undefined,      /* Opt out of parallel tests on CI. */
  reporter: [
    ['html', {
      open: 'always'
    }]
  ],
  use: {
    baseURL: 'https://www.saucedemo.com/',
    browserName: 'chromium',                    /* chromium firefox webkit */
    headless: true,
    permissions: ["clipboard-read"],
    actionTimeout: 60*1000,
    viewport: { width: 1200, height: 800},      /* Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. */
    screenshot: 'on',//'only-on-failure','on'
    trace: 'on',//'retain-on-failure','on'     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    video: 'on',//'retain-on-failure','on'
  },

  projects: [
    {
      name: 'English',
      use: { locale: 'en' , ...devices['Desktop Chrome'] },
    },
    {
      name: 'Portuguese',
      use: { locale: 'pt' , ...devices['Desktop Chrome'] },
    },
  ],
});