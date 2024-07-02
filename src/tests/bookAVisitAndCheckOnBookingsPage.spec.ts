import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, deleteVisit, getAccessToken } from '../support/testingHelperClient'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
})

test.describe('Book a visit and verify on bookins page', () => {
  test.beforeEach(async ({ context, loginPage, homePage }) => {
    context.clearCookies()
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signIntoBookVisitsService()
    await homePage.checkOnPage('Book a visit')
  })

  test('should not display any future visits on bookings page if the booker has no future visits', async ({
    bookingsPage,
  }) => {
    await bookingsPage.navigateToBookingsPage()
    await bookingsPage.checkOnPage('Bookings')
    const bookingsCount = await bookingsPage.getConfirmedBookingsCount()

    expect(await bookingsPage.isNoBookingsMessageDisplayed()).toBeTruthy()
    expect(await bookingsPage.getNoBookingsMessage()).toBe('You do not have any future bookings.')
    expect(bookingsCount).toBe(0)
  })

  test('should display future visits on bookings page if there are any', async ({
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
    bookingConfirmationPage,
    bookingsPage,
  }) => {
    await homePage.startBooking()
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.slectLastVisitor()
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()

    const visitDate = await visitCalendarPage.getSelectedDate()
    const visitTime = await visitCalendarPage.getSelectedTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectNoSupport()
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectMainContact()
    await mainContactPage.selectNoPhoneNumberProvided()
    await mainContactPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    await visitDetailsPage.submitBooking()

    await bookingConfirmationPage.checkOnPage('Visit booked')
    expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
    expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
    const visitReference = await bookingConfirmationPage.getReferenceNumber()
    GlobalData.set('visitReference', visitReference)

    await bookingConfirmationPage.waitForTimeout(2000)
    await bookingConfirmationPage.navigateToBookingsPage()
    await bookingsPage.checkOnPage('Bookings')


    const bookingsCount = await bookingsPage.getConfirmedBookingsCount()
    const confirmedVisitStartTime = await bookingsPage.getBookingStartTime()
    const confirmedVisitEndTime = await bookingsPage.getBookingEndTime()

    expect(bookingsCount).toBe(1)
    expect(await bookingsPage.getBookingDate()).toBe(visitDate)
    expect(`${confirmedVisitStartTime} to ${confirmedVisitEndTime}`).toBe(visitTime)
    expect(await bookingsPage.getBookingReference()).toBe(visitReference)
  })
})

test.afterAll('Teardown test data', async ({ request }) => {
  let appRef = GlobalData.getAll('applicationReference')
  let visitRef = GlobalData.getAll('visitReference')

  for (const visitId of visitRef) {
    await deleteVisit({ request }, visitId)
  }

  for (const applicationId of appRef) {
    await deleteApplication({ request }, applicationId)
  }
})
