import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, getAccessToken } from '../support/testingHelperClient'

test.beforeAll('Get access token and store so it is available as global data',async ({ request }) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
})

test.describe('Create a booking via public ui', () => {
  const additionalSupportDetails: string = 'Wheelchair access'
  const someOneElseAsMainContact: string = 'Mr Nobody'

  test('Book a visit - with 1 visitor and no additional support needed', async ({
    loginPage,
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signIntoBookVisitsService()

    homePage.checkOnPage('Book a visit')
    const prisonerName = await homePage.getPrisonerName()
    expect(prisonerName).toBe('Cinfsa Benison')
    await homePage.startBooking()

    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(1)
    const visitors = await visitorPage.getAllTheVisitorsNames()
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
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
    expect(visitDateAndTimeOnDetails).toBe(`${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe('None')
    expect(mainContactNameOnDetails).toContain(mainContact)

    await visitDetailsPage.submitBooking()
  })

  test('Book a visit - with 3 visitors and additional support needed', async ({
    loginPage,
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signIntoBookVisitsService()

    homePage.checkOnPage('Book a visit')
    const prisonerName = await homePage.getPrisonerName()
    expect(prisonerName).toBe('Cinfsa Benison')
    await homePage.startBooking()

    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(3)
    const visitors = await visitorPage.getAllTheVisitorsNames()
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    const visitTime = await visitCalendarPage.getSelectedTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectSupport(additionalSupportDetails)
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
    expect(visitDateAndTimeOnDetails).toBe(`${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe(additionalSupportDetails)
    expect(mainContactNameOnDetails).toContain(mainContact)

    await visitDetailsPage.submitBooking()
  })

  test('Book a visit - with 2 visitors and someone else as a main contact', async ({
    loginPage,
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signIntoBookVisitsService()

    homePage.checkOnPage('Book a visit')
    const prisonerName = await homePage.getPrisonerName()
    expect(prisonerName).toBe('Cinfsa Benison')
    await homePage.startBooking()

    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
    const visitors = await visitorPage.getAllTheVisitorsNames()
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    const visitTime = await visitCalendarPage.getSelectedTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectNoSupport()
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectSomeoneElse(someOneElseAsMainContact)
    await mainContactPage.selectNoPhoneNumberProvided()
    await mainContactPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
    const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
    const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
    const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
    const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

    expect(prisonerNameOnDetails).toBe(prisonerName)
    expect(visitorsNamesOnDetails).toEqual(visitors)
    expect(visitDateAndTimeOnDetails).toBe(`${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe('None')
    expect(mainContactNameOnDetails).toContain(someOneElseAsMainContact)

    await visitDetailsPage.submitBooking()
  })
})

test.afterAll('Clear all the applications from the DB', async ({ request }) => {
  let appRef = GlobalData.getAll('applicationReference')

  for (const applicationId of appRef) {
    const status = await deleteApplication({ request }, applicationId)
    expect(status).toBe(200)
    await new Promise(resolve => setTimeout(resolve, 200))
  }
})
