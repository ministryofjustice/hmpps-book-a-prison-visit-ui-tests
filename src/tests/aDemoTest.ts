import { expect, test } from "../fixtures/PageFixtures"
import GlobalData from "../setup/GlobalData"
import { getAccessToken } from "../support/testingHelperClient"



test.beforeAll('Get access token and store so it is available as global data', async ({ request }) => {
    GlobalData.set('authToken', await getAccessToken({ request }))
    console.log('authToken', GlobalData.get('authToken'))
  })

  test.describe('Demo test', () => {

    test('Demo test', async ({ page }) => {
      await page.goto('https://manage-prison-visits-dev.prison.service.justice.gov.uk')
      await page.fill('#username', process.env.DEV_USER || 'test')
      await page.fill('#password', process.env.DEV_PASSWORD || 'test')
      await page.press('#submit', 'Enter')
      await page.waitForSelector('h1')
      const title = await page.title()
      console.log('title', title)
      expect(title).toBe('Manage prison visits - Manage prison visits')
    })
  })