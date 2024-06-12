import { test, expect } from '../fixtures/PageFixtures'

test.describe('Create a booking to visit a prisoner - Fixtures', () => {
  test('Login to One login page and book a visit with defaults', async ({
    loginPage,
    homePage,
    visitorPage,
    visitCalendarPage,
    additionalSupportPage,
    mainContactPage,
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

    await visitCalendarPage.checkOnPage('Choose the visit time')
    await visitCalendarPage.selectFirstAvailableDate()
    await visitCalendarPage.selectFirstAvailableTime()

    await additionalSupportPage.checkOnPage('Is additional support needed for any of the visitors?')
    await additionalSupportPage.selectNoSupport()

    await mainContactPage.checkOnPage('Who is the main contact for this booking?')
    await mainContactPage.selectMainContact()
    await mainContactPage.selectNoPhoneNumberProvided()
    await mainContactPage.continue()
  })
})
