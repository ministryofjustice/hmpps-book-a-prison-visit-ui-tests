import { defineConfig, devices } from '@playwright/test'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export default defineConfig({
  globalTimeout: 60000 * 5,
  timeout: 60000,
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: process.env.CI !== undefined,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : undefined,
  /* Opt out of parallel tests on CI. */
  workers: 1,

  reporter: process.env.CI
    ? [
        ['junit', { outputFile: 'results.xml' }],
        ['html', { open: 'never' }],
      ]
    : [
        ['html', { open: 'never' }],
        ['allure-playwright', { detail: true, outputFolder: 'allure-results' }],
      ],
  use: {
    baseURL: 'https://visit-staging.prison.service.justice.gov.uk/',
    navigationTimeout: 60000,
    actionTimeout: 10000,
    testIdAttribute: 'data-test',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',

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
