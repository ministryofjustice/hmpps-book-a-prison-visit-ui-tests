import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, deleteVisit, getAccessToken } from '../support/testingHelperClient'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
  GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Create a booking via public ui', () => {
  const prisonerName: string = 'Arkmanain Editha'
  const additionalSupportDetails: string = 'Wheelchair access'
  const someOneElseAsMainContact: string = 'Mr Nobody'

  test.beforeEach(async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/home')

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
    bookingConfirmationPage,
    contactDetailsPage
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectLastVisitor()
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

    await mainContactPage.checkOnPage('Who is the main contact for this visit?')
    await mainContactPage.selectMainContact()
    const mainContact = await mainContactPage.getMainContactName()
    await mainContactPage.continueToNextPage()

    await contactDetailsPage.enterEmailAdd()
    await contactDetailsPage.enterPhoneNumber()
    await contactDetailsPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details')
    const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
    const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
    const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
    const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
    const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

    expect(prisonerNameOnDetails).toContain(prisonerName)
    expect(visitorsNamesOnDetails).toEqual(visitors)
    expect(visitDateAndTimeOnDetails.join(' ')).toBe(`${visitDate} ${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe('None')
    expect(mainContactNameOnDetails).toContain(mainContact)

    await visitDetailsPage.submitBooking()

    await bookingConfirmationPage.checkOnPage('Visit booked')
    expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
    expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
    const visitReference = await bookingConfirmationPage.getReferenceNumber()
    const nameOfThePrison = await bookingConfirmationPage.getPisonName()
    const prisonContactNumber = await bookingConfirmationPage.getPisonNumber()
    expect(nameOfThePrison).toContain('Foston Hall (HMP & YOI)')
    expect(prisonContactNumber).toContain('0123 456 7890')
    GlobalData.set('visitReference', visitReference)
    console.log('Confirmation message: ', visitReference)
  })

  test('Book a visit - with 3 visitors and additional support needed', async ({
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

    await mainContactPage.checkOnPage('Who is the main contact for this visit?')
    await mainContactPage.selectMainContact()
    const mainContact = await mainContactPage.getMainContactName()
    await mainContactPage.continueToNextPage()


    await contactDetailsPage.enterEmailAdd()
    await contactDetailsPage.enterPhoneNumber()
    await contactDetailsPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details')
    const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
    const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
    const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
    const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
    const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

    expect(prisonerNameOnDetails).toContain(prisonerName)
    expect(visitorsNamesOnDetails).toEqual(visitors)
    expect(visitDateAndTimeOnDetails.join(' ')).toEqual(`${visitDate} ${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe(additionalSupportDetails)
    expect(mainContactNameOnDetails).toContain(mainContact)

    await visitDetailsPage.submitBooking()

    await bookingConfirmationPage.checkOnPage('Visit booked')
    expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
    expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
    const visitReference = await bookingConfirmationPage.getReferenceNumber()
    const nameOfThePrison = await bookingConfirmationPage.getPisonName()
    const prisonContactNumber = await bookingConfirmationPage.getPisonNumber()
    expect(nameOfThePrison).toContain('Foston Hall (HMP & YOI)')
    expect(prisonContactNumber).toContain('0123 456 7890')
    GlobalData.set('visitReference', visitReference)
    console.log('Confirmation message: ', visitReference)
  })

  test('Book a visit - with 2 visitors and someone else as a main contact', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
    visitDetailsPage,
    bookingConfirmationPage,
    contactDetailsPage
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

    await mainContactPage.checkOnPage('Who is the main contact for this visit?')
    await mainContactPage.selectSomeoneElse(someOneElseAsMainContact)
    await mainContactPage.continueToNextPage()
 
    await contactDetailsPage.enterEmailAdd()
    await contactDetailsPage.enterPhoneNumber()
    await contactDetailsPage.continueToNextPage()

    await visitDetailsPage.checkOnPage('Check the visit details')
    const prisonerNameOnDetails = await visitDetailsPage.getPrisonerName()
    const visitorsNamesOnDetails = await visitDetailsPage.getAllTheVisitorsNames()
    const visitDateAndTimeOnDetails = await visitDetailsPage.getSelectedDateAndTime()
    const additionalSupportDetailsOnDetails = await visitDetailsPage.getAdditionalSupportDetails()
    const mainContactNameOnDetails = await visitDetailsPage.getMainContactName()

    expect(prisonerNameOnDetails).toContain(prisonerName)
    expect(visitorsNamesOnDetails).toEqual(visitors)
    expect(visitDateAndTimeOnDetails.join(' ')).toBe(`${visitDate} ${visitTime}`)
    expect(additionalSupportDetailsOnDetails).toBe('None')
    expect(mainContactNameOnDetails).toContain(someOneElseAsMainContact)

    await visitDetailsPage.submitBooking()

    await bookingConfirmationPage.checkOnPage('Visit booked')
    expect(await bookingConfirmationPage.isBookingConfirmationDisplayed()).toBeTruthy()
    expect(await bookingConfirmationPage.isVisitDetailsDisplayed()).toBeTruthy()
    const visitReference = await bookingConfirmationPage.getReferenceNumber()
    const nameOfThePrison = await bookingConfirmationPage.getPisonName()
    const prisonContactNumber = await bookingConfirmationPage.getPisonNumber()
    expect(nameOfThePrison).toContain('Foston Hall (HMP & YOI)')
    expect(prisonContactNumber).toContain('0123 456 7890')
    GlobalData.set('visitReference', visitReference)
    console.log('Confirmation message: ', visitReference)
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
