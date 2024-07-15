import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, deleteVisit, getAccessToken } from '../support/testingHelperClient'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
  GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Create a booking and change the visit details', () => {
  const prisonerName: string = 'Yhsreepal Edica'
  const additionalSupportDetails: string = 'Wheelchair access'
  const someOneElseAsMainContact: string = 'Mr Nobody'
  const mainContactPhoneNumber: string = '07123456789'

  test.beforeEach(async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/')

    const name = await homePage.getPrisonerName()
    expect(name).toBe(prisonerName)
    await homePage.startBooking()
  })

  test('should be able to change visitors for the booking', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
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
    await visitDetailsPage.changeVisitors()
    await visitorPage.checkOnPage('Who is going on the visit?')
    const currentVisitors = await visitorPage.getAllTheVisitorsNamesWithAge()
    expect(currentVisitors).toEqual(visitors)
    await visitorPage.selectVisitors(2)
    const newVisitors = await visitorPage.getAllTheVisitorsNamesWithAge()
    await visitorPage.continueToNextPage()
    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    GlobalData.set('applicationReference', applicationReference)
    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.continueToNextPage()
    await visitDetailsPage.checkOnPage('Check the visit details before booking')

    const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
    const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
    const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
    const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
    const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

    expect(prisonerNameOnDetails).toBe(prisonerName)
    expect(visitorsNamesOnDetails).toEqual(newVisitors)
    expect(visitDateAndTimeOnDetails.join(' ')).toBe(`${visitDate} ${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe('None')
    expect(mainContactNameOnDetails).toContain(mainContact)
  })

  test('should be able to change date and time for the booking', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
    const visitors = await visitorPage.getAllTheVisitorsNamesWithAge()
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
    await visitDetailsPage.changeDateTime()
    await visitCalendarPage.checkOnPage('Choose the visit time')

    const currentVisitDate = await visitCalendarPage.getSelectedDate()
    const currentVisitTime = await visitCalendarPage.getSelectedTime()

    expect(`${currentVisitDate} ${currentVisitTime}`).toEqual(`${visitDate} ${visitTime}`)

    await visitCalendarPage.selectRandomAvailableDateAndTime()

    const newVisitDate = await visitCalendarPage.getSelectedDate()
    const newVisitTime = await visitCalendarPage.getSelectedTime()

    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.continueToNextPage()
    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.continueToNextPage()
    await visitDetailsPage.checkOnPage('Check the visit details before booking')

    const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
    const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
    const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
    const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
    const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

    expect(prisonerNameOnDetails).toBe(prisonerName)
    expect(visitorsNamesOnDetails).toEqual(visitors)
    expect(visitDateAndTimeOnDetails.join(' ')).toEqual(`${newVisitDate} ${newVisitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe(additionalSupportDetails)
    expect(mainContactNameOnDetails).toContain(mainContact)
  })

  test('should be able to update additional support requests for the booking', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
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
    await mainContactPage.selectSomeoneElse(someOneElseAsMainContact)
    await mainContactPage.selectNoPhoneNumberProvided()
    await mainContactPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    await visitDetailsPage.changeAdditionalSupport()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    expect(await additionalSupportPage.isAdditionalSupportInputboxVisible()).toBeFalsy()

    await additionalSupportPage.selectSupport(additionalSupportDetails)
    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
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
    expect(additionalSupportDetailsOnDetails).toBe(additionalSupportDetails)
    expect(mainContactNameOnDetails).toContain(someOneElseAsMainContact)
  })

  test('should be able to update main contact details for the booking', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
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
    await mainContactPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')
    await visitDetailsPage.changeMainContact()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    expect(await mainContactPage.isSomeoneElseNameInputboxVisible()).toBeFalsy()

    await mainContactPage.selectSomeoneElse(someOneElseAsMainContact)
    await mainContactPage.selectUKPhoneNumber(mainContactPhoneNumber)
    await mainContactPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details before booking')

    const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
    const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
    const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
    const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
    const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

    console.log('mainContactNameOnDetails', mainContactNameOnDetails)
    expect(prisonerNameOnDetails).toBe(prisonerName)
    expect(visitorsNamesOnDetails).toEqual(visitors)
    expect(visitDateAndTimeOnDetails.join(' ')).toBe(`${visitDate} ${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe('None')
    expect(mainContactNameOnDetails).toBe(`${someOneElseAsMainContact} ${mainContactPhoneNumber}`)
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
