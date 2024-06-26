import { defineConfig, devices } from '@playwright/test'
require('dotenv').config()

const oneLoginUsername = process.env.INTEG_USER_NAME ?? ''
const oneLoginPassword = process.env.INTEG_PASSWORD ?? ''

export default defineConfig({
  globalTimeout: 60000,
  timeout: 30000,
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: process.env.CI !== undefined,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: 1,

  reporter: process.env.CI
    ? [['junit', { outputFile: 'results.xml' }]]
    : [
        ['html', { open: 'never' }],
        ['allure-playwright', { detail: true, outputFolder: 'allure-results' }],
      ],
  use: {
    baseURL: 'https://visit-staging.prison.service.justice.gov.uk/',
    navigationTimeout: 60000,
    actionTimeout: 60000,
    testIdAttribute: 'data-test',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      args: ['--ignore-certificate-errors'],
    },
    httpCredentials: {
      username: oneLoginUsername,
      password: oneLoginPassword,
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
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
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
