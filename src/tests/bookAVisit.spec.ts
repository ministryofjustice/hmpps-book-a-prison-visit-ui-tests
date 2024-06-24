import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, deleteVisit, getAccessToken, updateVisitStatus } from '../support/testingHelperClient'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
})

test.describe('Create a booking via public ui', () => {
  const prisonerName: string = 'Yhsreepal Edica'
  const additionalSupportDetails: string = 'Wheelchair access'
  const someOneElseAsMainContact: string = 'Mr Nobody'

  test.beforeEach(async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signIntoBookVisitsService()

    homePage.checkOnPage('Book a visit')
    const name = await homePage.getPrisonerName()
    expect(name).toBe(prisonerName)
    await homePage.startBooking()
  })

  test('Book a visit - with 1 visitor and no additional support needed', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.slectLastVisitor()
    const visitors = await visitorPage.getAllTheVisitorsNames()
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

    const visitReference = await visitDetailsPage.submitBooking()
    GlobalData.set('visitReference', visitReference)
    console.log('Confirmation message: ', visitReference)
  })

  test('Book a visit - with 3 visitors and additional support needed', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {

    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(3)
    const visitors = await visitorPage.getAllTheVisitorsNames()
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()

    const visitDate = await visitCalendarPage.getSelectedDate()
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
    expect(visitDateAndTimeOnDetails.join(' ')).toEqual(`${visitDate} ${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe(additionalSupportDetails)
    expect(mainContactNameOnDetails).toContain(mainContact)

    const visitReference = await visitDetailsPage.submitBooking()
    GlobalData.set('visitReference', visitReference)
    console.log('Confirmation message: ', visitReference)
  })

  test('Book a visit - with 2 visitors and someone else as a main contact', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {

    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
    const visitors = await visitorPage.getAllTheVisitorsNames()
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
    expect(visitDateAndTimeOnDetails.join(' ')).toBe(`${visitDate} ${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe('None')
    expect(mainContactNameOnDetails).toContain(someOneElseAsMainContact)

    const visitReference = await visitDetailsPage.submitBooking()
    GlobalData.set('visitReference', visitReference)
    console.log('Confirmation message: ', visitReference)
  })
})

test.afterAll('Clear all the applications from the DB', async ({ request }) => {
  let appRef = GlobalData.getAll('applicationReference')
  let visitRef = GlobalData.getAll('visitReference')

  for (const visitId of visitRef) {
    const status = await updateVisitStatus({ request }, visitId, 'CANCELLED')
    expect(status).toBe(200)
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  for (const visitId of visitRef) {
    const status = await deleteVisit({ request }, visitId)
    expect(status).toBe(200)
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  for (const applicationId of appRef) {
    const status = await deleteApplication({ request }, applicationId)
    expect(status).toBe(200)
    await new Promise(resolve => setTimeout(resolve, 200))
  }
})
