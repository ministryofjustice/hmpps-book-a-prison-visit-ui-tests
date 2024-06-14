import { defineConfig, devices } from '@playwright/test'
require('dotenv').config()

export default defineConfig({
  globalTimeout: 60000,
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : 1,

  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://visit-dev.prison.service.justice.gov.uk/',
    navigationTimeout: 60000,
    actionTimeout: 60000,
    testIdAttribute: 'data-test',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    launchOptions: {
      args: ['--ignore-certificate-errors'],
    },
    httpCredentials: {
      username: process.env.INTEG_USER_NAME ?? '',
      password: process.env.INTEG_PASSWORD ?? '',
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test against mobile viewports. */
    {
      name: 'iPhone13',
      use: { ...devices['iPhone 13 Pro Max'] },
    },
    {
      name: 'nexus7',
      use: { ...devices['Nexus 7'] },
    },
  ],
})
