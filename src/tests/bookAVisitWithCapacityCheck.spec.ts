import { chromium, devices } from '@playwright/test'
import { test, expect } from '../fixtures/PageFixtures'
import AdditionalSupportPage from '../pages/AdditionalSupportPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import VisitorPage from '../pages/VisitorPage'
import VisitsCalendarPage from '../pages/VisitsCalendarPage'
import GlobalData from '../setup/GlobalData'
import {
  deleteApplication,
  deleteVisit,
  getAccessToken,
  updateModifyTimestamp,
  updateOpenSessionCapacity,
} from '../support/testingHelperClient'

test.beforeAll('Get access token and store as global variable', async ({ request }, testInfo) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
  GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Create a booking with capacity checks', () => {
  const prisonerName: string = 'Arkmanain Editha'
  const someOneElseAsMainContact: string = 'Mr Nobody'

  test.beforeEach(async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/')

    const name = await homePage.getPrisonerName()
    expect(name).toBe(prisonerName)
    await homePage.startBooking()
  })

  test('Book a visit - capacity is 1, set time to -20 mins, block 2nd session with another booking and verify failed booking', async ({
    request,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(3)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectNoSupport()
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    console.log(`Application Reference: ${applicationReference}`)

    await additionalSupportPage.waitForTimeout(1000)
    let status = await updateOpenSessionCapacity({ request }, applicationReference, 1)
    expect(status).toBe(200)

    status = await updateModifyTimestamp({ request }, applicationReference, '20')
    expect(status).toBe(200)

    await additionalSupportPage.continueToNextPage()

    // Wait for the timestamp to be updated
    await additionalSupportPage.waitForTimeout(1000)
    // New page to create a second booking application to block the session

    const browser = await chromium.launch()
    const context = await browser.newContext({
      ...devices['iPhone 14 Pro Max'],
    })
    await context.clearCookies()
    const newPage = await context.newPage()

    // New page objects for the second booking
    const newLoginPage = new LoginPage(newPage)
    const newHomePage = new HomePage(newPage)
    const newVisitorPage = new VisitorPage(newPage)
    const newVisitCalendarPage = new VisitsCalendarPage(newPage)
    const newAdditionalSupportPage = new AdditionalSupportPage(newPage)

    await newLoginPage.navigateTo('/')
    await newLoginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await newLoginPage.goToSignInPage()
    await newLoginPage.signInWithANewUser()

    await newHomePage.checkOnPage('Book a visit')
    await newHomePage.startBooking()

    await newVisitorPage.checkOnPage('Who is going on the visit?')
    await newVisitorPage.selectVisitors(3)
    await newVisitorPage.continueToNextPage()

    await newVisitCalendarPage.checkOnPage('Choose the visit time')
    await newVisitCalendarPage.selectFirstAvailableDate()
    await newVisitCalendarPage.selectFirstAvailableTime()
    await newVisitCalendarPage.continueToNextPage()

    await newAdditionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await newAdditionalSupportPage.selectNoSupport()
    const newApplicationReference = await newAdditionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', newApplicationReference)
    console.log(`Application Reference: ${newApplicationReference}`)
    // Blocked the session

    // Continue with the first booking
    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectSomeoneElse(someOneElseAsMainContact)
    await mainContactPage.selectNoPhoneNumberProvided()
    await mainContactPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    await visitDetailsPage.submitBooking()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    expect(await visitCalendarPage.isVisitTimeNolongerAvailableMessageVisible()).toBeTruthy()
    expect(await visitCalendarPage.getVisitTimeNolongerAvailableMessage()).toContain(
      'Your visit time is no longer available. Select a new time.',
    )
  })

  test('Book a visit - set capacity to 0 and verify failed booking', async ({
    request,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectNoSupport()
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    console.log(`Application Reference: ${applicationReference}`)

    let status = await updateOpenSessionCapacity({ request }, applicationReference, 0)
    expect(status).toBe(200)

    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectSomeoneElse(someOneElseAsMainContact)
    await mainContactPage.selectNoPhoneNumberProvided()
    await mainContactPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    await visitDetailsPage.submitBooking()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    expect(await visitCalendarPage.isVisitTimeNolongerAvailableMessageVisible()).toBeTruthy()
    expect(await visitCalendarPage.getVisitTimeNolongerAvailableMessage()).toContain(
      'Your visit time is no longer available. Select a new time.',
    )
  })

  test('Book a visit - set capacity to 1 and update time to -20 mins then verify booking', async ({
    request,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
    bookingConfirmationPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(3)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectNoSupport()
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    console.log(`Application Reference: ${applicationReference}`)

    let status = await updateOpenSessionCapacity({ request }, applicationReference, 1)
    expect(status).toBe(200)

    status = await updateModifyTimestamp({ request }, applicationReference, '20')
    expect(status).toBe(200)

    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectSomeoneElse(someOneElseAsMainContact)
    await mainContactPage.selectNoPhoneNumberProvided()
    await mainContactPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    await visitDetailsPage.submitBooking()

    await bookingConfirmationPage.checkOnPage('Visit booked')
    expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
    expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
    const visitReference = await bookingConfirmationPage.getReferenceNumber()
    GlobalData.set('visitReference', visitReference)
    console.log('Confirmation message: ', visitReference)
  })
})

test.afterAll('Teardown test data', async ({ request }) => {
  let appRef = GlobalData.getAll('applicationReference')
  let visitRef = GlobalData.getAll('visitReference')

  for (const applicationId of appRef) {
    await updateOpenSessionCapacity({ request }, applicationId, 24)
  }

  for (const visitId of visitRef) {
    await deleteVisit({ request }, visitId)
  }

  for (const applicationId of appRef) {
    await deleteApplication({ request }, applicationId)
  }
})
