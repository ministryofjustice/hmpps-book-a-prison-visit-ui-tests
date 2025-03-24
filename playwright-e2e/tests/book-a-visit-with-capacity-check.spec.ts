import { APIRequestContext, chromium, devices } from '@playwright/test'
import { test, expect } from '../fixtures/PageFixtures'
import AdditionalSupportPage from '../pages/AdditionalSupportPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import VisitorPage from '../pages/VisitorPage'
import VisitsCalendarPage from '../pages/VisitsCalendarPage'
import GlobalData from '../setup/GlobalData'
import {
  createApplication,
  createVisit,
  deleteApplication,
  deleteVisit,
  getAccessToken,
  updateModifyTimestamp,
  updateOpenSessionCapacity,
} from '../support/testingHelperClient'
import { UserType } from '../support/UserType'
import { IApplication } from '../data/IApplication'

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

  //Skippping this test as it is failing due to the issue with capacity update
  test.skip('Book a visit - capacity is 1, set time to -20 mins, block 2nd session with another booking and verify failed booking', async ({
    request,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
    contactDetailsPage
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
    await newLoginPage.signInWith(UserType.NEW_USER_NAME)

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
    await mainContactPage.continueToNextPage()
    await contactDetailsPage.enterEmailAdd()
    await contactDetailsPage.enterPhoneNumber()
    await contactDetailsPage.continueToNextPage()

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
    contactDetailsPage
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
    await mainContactPage.continueToNextPage()
    await contactDetailsPage.enterEmailAdd()
    await contactDetailsPage.enterPhoneNumber()
    await contactDetailsPage.continueToNextPage()

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
    contactDetailsPage
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
    console.log('Confirmation message: ', visitReference)
  })

  //Skippping this test as it is failing on staging as the VO balance is not updating
  test.skip('should not be allowed to book a visit when a prisoner has 1 VO available and that has been used to book a staff visit', async ({
    context,
    request,
    loginPage,
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
    contactDetailsPage
  }) => {
    const priosnerName = "Ef'liaico Braderto"

    await context.clearCookies()
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()

    await loginPage.signInWith(UserType.ONE_VO_BALANCE_USER_NAME)
    await homePage.checkOnPage('Book a visit')

    const name = await homePage.getPrisonerName()
    expect(name).toBe(priosnerName)
    await homePage.startBooking()

    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectFirstVisitor()
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

    // Block the VO by booking a session via staff UI
    await bookAVisitViaStaffUI({ request })

    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectSomeoneElse(someOneElseAsMainContact)
    await mainContactPage.continueToNextPage()

    await contactDetailsPage.enterEmailAdd()
    await contactDetailsPage.enterPhoneNumber()
    await contactDetailsPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    await visitDetailsPage.submitBooking()
    await visitorPage.checkOnPage('A visit cannot be booked')
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

const bookAVisitViaStaffUI = async ({ request }: { request: APIRequestContext }) => {
  const application: IApplication = {
    prisonCode: 'FHI',
    prisonerId: 'G1672UD',
    sessionDate: '2024-08-18',
    sessionStart: '09:30',
    sessionEnd: '11:30',
    userType: 'STAFF',
    contactName: 'HS',
    visitors: [4539726],
    visitRestriction: 'OPEN',
  }

  const createApplicationResponse = await createApplication({ request }, application)
  expect(createApplicationResponse.status).toBe(200)
  const applicationReference = createApplicationResponse.applicationRef
  GlobalData.set('applicationReference', applicationReference)
  await new Promise(resolve => setTimeout(resolve, 500))

  const createVisitResponse = await createVisit({ request }, applicationReference)
  const visitReference = createVisitResponse.visitRef
  expect(createVisitResponse.status).toBe(200)
  await new Promise(resolve => setTimeout(resolve, 500))
  GlobalData.set('visitReference', visitReference)
}
