import { expect, test } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'

test.beforeAll('Get access token and store so it is available as global data', async ({}, testInfo) => {
  GlobalData.set('deviceName', testInfo.project.name)
})

const prisonerName: string = 'Sam Cake'

test.beforeEach(async ({ context, loginPage }) => {
  context.clearCookies()
  await loginPage.navigateTo('/')
  await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
  await loginPage.goToSignInPage()
})

test.describe('Unhappy path validations', () => {
  test('should display You cannot access this service message when user is not a booker', async ({
    loginPage,
    homePage,
  }) => {
    await loginPage.signAsUnknownBooker()
    await homePage.checkOnPage('You cannot access this service')

    expect(await homePage.doesUrlContain('access-denied')).toBeTruthy()
  })

  test('should not allow user to book a visit when there are no VO balance', async ({
    loginPage,
    homePage,
    visitorPage,
  }) => {
    await loginPage.signAsAUserWithNoVOBalance()
    await homePage.checkOnPage('Book a visit')

    const name = await homePage.getPrisonerName()
    expect(name).toBe(prisonerName)
    await homePage.startBooking()
    await visitorPage.checkOnPage('A visit cannot be booked')

    expect(await homePage.doesUrlContain('visit-cannot-be-booked')).toBeTruthy()
  })
})
