import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, deleteVisit, getAccessToken } from '../support/testingHelperClient'
import { UserType } from '../support/UserType'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
  GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Book a visit and verify on bookins page', () => {
  const prisonerName = 'Arkmanain Editha'
  const additionalSupportRequired = 'Wheelchair access'
  const mainContactPhoneNumber = '07123456789'

  test.beforeEach(async ({ context, loginPage, homePage }) => {
    context.clearCookies()
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Visit someone in prison')
    await loginPage.clickStartNowButton()
    await loginPage.goToSignInPage()
    await loginPage.signInWith(UserType.USER_NAME)
    await homePage.checkOnPage('Book a visit')
  })

  test('should not display any future visits on bookings page if the booker has no future visits', async ({
    bookingsPage,
  }) => {
    await bookingsPage.navigateToBookingsPage()
    await bookingsPage.checkOnPage('Bookings')
    expect(await bookingsPage.isNoBookingsMessageDisplayed()).toBeTruthy()
    expect(await bookingsPage.getNoBookingsMessage()).toBe('You do not have any future bookings.')
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
    contactDetailsPage
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
    await mainContactPage.continueToNextPage()
    await contactDetailsPage.enterEmailAdd()
    await contactDetailsPage.enterPhoneNumber()
    await contactDetailsPage.continueToNextPage()

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

    const confirmedVisitStartTime = await bookingsPage.getBookingStartTime()
    const confirmedVisitEndTime = await bookingsPage.getBookingEndTime()

    expect(await bookingsPage.getBookingDate()).toBe(visitDate)
    expect(`${confirmedVisitStartTime} to ${confirmedVisitEndTime}`).toBe(visitTime)
    expect(await bookingsPage.getBookingReference()).toBe(visitReference)
  })

  test('should take user to booking details page when user clicks on view booking details link', async ({
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
    bookingConfirmationPage,
    bookingsPage,
    bookingDetailsPage,
    contactDetailsPage
  }) => {
    await homePage.startBooking()
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(3)
    const visitors = await visitorPage.getAllTheVisitorsNames()
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectRandomAvailableDateAndTime()

    const visitDate = await visitCalendarPage.getSelectedDate()
    const visitTime = await visitCalendarPage.getSelectedTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectSupport(additionalSupportRequired)
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectMainContact()
    const mainContact = await mainContactPage.getMainContactName()
    await mainContactPage.continueToNextPage()

    await contactDetailsPage.enterEmailAdd()
    await contactDetailsPage.enterPhoneNumber()
    await contactDetailsPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    await visitDetailsPage.submitBooking()

    await bookingConfirmationPage.checkOnPage('Visit booked')
    expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
    expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
    const visitReference = await bookingConfirmationPage.getReferenceNumber()
    GlobalData.set('visitReference', visitReference)

    await bookingConfirmationPage.navigateToBookingsPage()
    await bookingsPage.checkOnPage('Bookings')
    await bookingsPage.clickBookingDetailsLink()
    await bookingDetailsPage.checkOnPage('Visit booking details')

    const convirmedVisitReferenceId = await bookingDetailsPage.getVisitReferenceNumber()
    const confirmedVisitDate = await bookingDetailsPage.getVisitDate()
    const confirmedVisitStartTime = await bookingDetailsPage.getVisitStartTime()
    const confirmedVisitEndTime = await bookingDetailsPage.getVisitEndTime()
    const confirmedPrisonerName = await bookingDetailsPage.getPrisonerName()
    const confirmedMainContact = await bookingDetailsPage.getMainContactName()
    const confirmedMainContactPhoneNumber = await bookingDetailsPage.getMainContactPhoneNumber()
    const confirmedVisitors = await bookingDetailsPage.getVisitorsNames()
    const confirmedAdditionalSupport = await bookingDetailsPage.getAdditionalSupportRequest()

    expect(convirmedVisitReferenceId).toBe(visitReference)
    expect(confirmedVisitDate).toBe(visitDate)
    expect(`${confirmedVisitStartTime} to ${confirmedVisitEndTime}`).toBe(visitTime)
    expect(confirmedPrisonerName).toBe(prisonerName)
    expect(confirmedMainContact).toBe(mainContact)
    // expect(confirmedMainContactPhoneNumber).toBe(mainContactPhoneNumber)
    expect(confirmedVisitors.length).toBe(visitors.length)
    expect(confirmedVisitors).toEqual(expect.arrayContaining(visitors))
    expect(confirmedAdditionalSupport).toBe(additionalSupportRequired)
  })
})

test.afterEach('Teardown test data', async ({ request }) => {
  let appRef = GlobalData.getAll('applicationReference')
  let visitRef = GlobalData.getAll('visitReference')

  for (const visitId of visitRef) {
    await deleteVisit({ request }, visitId)
  }

  for (const applicationId of appRef) {
    await deleteApplication({ request }, applicationId)
  }
})
