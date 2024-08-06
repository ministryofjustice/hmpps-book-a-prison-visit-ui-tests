import { _android as android } from 'playwright'
import { expect, test } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, deleteVisit, getAccessToken } from '../support/testingHelperClient'
import AdditionalSupportPage from '../pages/AdditionalSupportPage'
import BookingConfirmationPage from '../pages/BookingConfirmationPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import MainContactPage from '../pages/MainContactPage'
import VisitDetailsPage from '../pages/VisitDetailsPage'
import VisitorPage from '../pages/VisitorPage'
import VisitsCalendarPage from '../pages/VisitsCalendarPage'
import { UserType } from '../support/UserType'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
  GlobalData.set('deviceName', testInfo.project.name)
})

const url = 'https://visit-dev.prison.service.justice.gov.uk/'
const prisonerName: string = 'Yhsreepal Edica'

test.skip('should be able to run test on android browser', async ({ page }) => {
  const [device] = await android.devices()

  // New page objects for the second booking
  const loginPage = new LoginPage(page)
  const homePage = new HomePage(page)
  const visitorPage = new VisitorPage(page)
  const visitCalendarPage = new VisitsCalendarPage(page)
  const additionalSupportPage = new AdditionalSupportPage(page)
  const mainContactPage = new MainContactPage(page)
  const visitDetailsPage = new VisitDetailsPage(page)
  const bookingConfirmationPage = new BookingConfirmationPage(page)

  console.log(`Model: ${device.model()}`)
  console.log(`Serial: ${device.serial()}`)
  await loginPage.navigateTo(url)
  await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
  await loginPage.goToSignInPage()
  await loginPage.signInWith(UserType.USER_NAME)

  await homePage.checkOnPage('Book a visit')
  await homePage.startBooking()

  await visitorPage.checkOnPage('Who is going on the visit?')
  await visitorPage.slectLastVisitor()
  const visitors = await visitorPage.getAllTheVisitorsNamesWithAge()
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
  const mainContact = await mainContactPage.getMainContactName()
  await mainContactPage.continueToNextPage()

  await visitDetailsPage.checkOnPage('Check the visit details before booking')
  const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
  const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
  const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
  const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
  const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

  expect(prisonerNameOnDetails).toBe(prisonerName)
  expect(visitorsNamesOnDetails).toEqual(visitors)
  expect(visitDateAndTimeOnDetails.join(' ')).toBe(`${visitDate} ${visitTime}`)
  expect(additionalSupportDetailsOnDetails).toBe('None')
  expect(mainContactNameOnDetails).toContain(mainContact)

  await visitDetailsPage.submitBooking()

  await bookingConfirmationPage.checkOnPage('Visit booked')
  expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
  expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
  const visitReference = await bookingConfirmationPage.getReferenceNumber()
  GlobalData.set('visitReference', visitReference)
  console.log('Confirmation message: ', visitReference)

  await homePage.signOut()
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
