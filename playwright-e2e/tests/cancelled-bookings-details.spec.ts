import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { getAccessToken } from '../support/testingHelperClient'
import { UserType } from '../support/UserType'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
  GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Verify cancelled bookings details', () => {

  test.beforeEach(async ({ context, loginPage, homePage }) => {
    context.clearCookies()
    await loginPage.navigateTo('/home')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.signInWith(UserType.USER_NAME)
    await homePage.checkOnPage('Book a visit')
  })
  test("Cancelled bookings should not be displayed when there aren't any", async ({
    bookingsPage, cancelledBookingsPage
  }) => {
    const cancelledBookings = await cancelledBookingsPage.getCancelledBookingsCount()
    await bookingsPage.navigateToBookingsPage()
    await bookingsPage.checkOnPage('Bookings')
    await bookingsPage.clickViewCancelledVisitsLink()
    expect(cancelledBookings).toBe(0)
  })
  
  // TODO -- Add test to verify cancelled bookings that are in the past.

})