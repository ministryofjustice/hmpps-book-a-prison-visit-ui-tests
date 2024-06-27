import { expect, test } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { deleteApplication, getAccessToken } from '../support/testingHelperClient'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }) => {
  GlobalData.set('authToken', await getAccessToken({ request }))
})

test.describe('Form validation error messages', () => {
  const prisonerName: string = 'Yhsreepal Edica'

  test.beforeEach('Login', async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/')
    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signIntoBookVisitsService()

    homePage.checkOnPage('Book a visit')
    const name = await homePage.getPrisonerName()
    expect(name).toBe(prisonerName)
    await homePage.startBooking()
  })

  test('should display no visitors selected error message', async ({ visitorPage }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.continueToNextPage()

    expect(await visitorPage.isErrorMessageDisplayed()).toBeTruthy()
    expect(await visitorPage.getFormErrorMessage()).toContain('No visitors selected')
    expect(await visitorPage.getAlertErrorMessage()).toContain('No visitors selected')
  })

  test('should display add a visitor who is 18 years old or older error message', async ({ visitorPage }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectFirstVisitor()
    await visitorPage.continueToNextPage()

    expect(await visitorPage.isErrorMessageDisplayed()).toBeTruthy()
    expect(await visitorPage.getFormErrorMessage()).toContain('Add a visitor who is 18 years old or older')
    expect(await visitorPage.getAlertErrorMessage()).toContain('Add a visitor who is 18 years old or older')
  })

  test('should display no visit time selected error message', async ({ visitorPage, visitCalendarPage }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.continueToNextPage()
    expect(await visitCalendarPage.isErrorMessageDisplayed()).toBeTruthy()
    expect(await visitCalendarPage.getFormErrorMessage()).toContain('No visit time selected')
    expect(await visitCalendarPage.getAlertErrorMessage()).toContain('No visit time selected')
  })

  test('should display no answer selected error message on additional support page', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    await additionalSupportPage.continueToNextPage()

    expect(await additionalSupportPage.isErrorMessageDisplayed()).toBeTruthy()
    expect(await additionalSupportPage.getFormErrorMessage()).toContain('No answer selected')
    expect(await additionalSupportPage.getAlertErrorMessage()).toContain('No answer selected')
  })

  test('should display enter details of the request error message when provide additional details edit box is left blank', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    await additionalSupportPage.selectSupport('')
    await additionalSupportPage.continueToNextPage()

    expect(await additionalSupportPage.isErrorMessageDisplayed()).toBeTruthy()
    expect(await additionalSupportPage.getFormErrorMessage()).toContain('Enter details of the request')
    expect(await additionalSupportPage.getAlertErrorMessage()).toContain('Enter details of the request')
  })

  test('should display main contact and phone number not seleted error message on select main contact page', async ({
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
  }) => {
    await visitorPage.checkOnPage('Who is going on the visit?')
    await visitorPage.selectVisitors(2)
    await visitorPage.continueToNextPage()

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()
    await visitCalendarPage.continueToNextPage()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    const applicationReference = await additionalSupportPage.getApplicationReference()
    GlobalData.set('applicationReference', applicationReference)
    await additionalSupportPage.selectNoSupport()
    await additionalSupportPage.continueToNextPage()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.continueToNextPage()

    expect(await mainContactPage.isErrorMessageDisplayed()).toBeTruthy()
    expect(await mainContactPage.getFormNoContactErrorMessage()).toContain('No main contact selected')
    expect(await mainContactPage.getFormNoNumberErrorMessage()).toContain('No answer selected')
    expect(await mainContactPage.getAlertErrorMessage()).toContain('No main contact selected No answer selected')

    await mainContactPage.selectSomeoneElse('')
    await mainContactPage.selectUKPhoneNumber('')
    await mainContactPage.continueToNextPage()

    expect(await mainContactPage.isErrorMessageDisplayed()).toBeTruthy()
    expect(await mainContactPage.getFormSomeoneElseErrorMessage()).toContain('Enter the name of the main contact')
    expect(await mainContactPage.getFormNoNumberErrorMessage()).toContain('Enter a phone number')
    expect(await mainContactPage.getAlertErrorMessage()).toContain(
      'Enter the name of the main contact Enter a phone number',
    )
  })
})

test.afterAll('Sign out and clear test data', async ({ request }) => {
  let appRef = GlobalData.getAll('applicationReference')

  for (const applicationId of appRef) {
    await deleteApplication({ request }, applicationId)
  }
})
