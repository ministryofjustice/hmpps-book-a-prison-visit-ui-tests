import { expect, test } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { UserType } from '../support/UserType'

test.beforeAll('Get access token and store so it is available as global data', async ({}, testInfo) => {
  GlobalData.set('deviceName', testInfo.project.name)
})

const prisonerName: string = 'Sam Cake'

test.beforeEach(async ({ context, loginPage }) => {
  context.clearCookies()
  await loginPage.navigateTo('/')
  await loginPage.checkOnPage('Visit someone in prison')
  await loginPage.clickStartNowButton()
  await loginPage.goToSignInPage()
})

test.describe('Unhappy path validations', () => {
  test.skip('should display You cannot access this service message when user is not a booker', async ({
    loginPage,
    homePage,
  }) => {
    await loginPage.signInWith(UserType.UNKNOWN_USER_NAME)
    await homePage.checkOnPage('You cannot access this service')

    expect(await homePage.doesUrlContain('access-denied')).toBeTruthy()
  })

  test('should not allow user to book a visit when there are no VO balance', async ({
    loginPage,
    homePage,
    visitorPage,
  }) => {
    await loginPage.signInWith(UserType.NO_VO_USER_NAME)
    await homePage.checkOnPage('Book a visit')

    const name = await homePage.getPrisonerName()
    expect(name).toBe(prisonerName)
    await homePage.startBooking()
    await visitorPage.checkOnPage('A visit cannot be booked')

    expect(await homePage.doesUrlContain('visit-cannot-be-booked')).toBeTruthy()
  })

  test('should be land on the new signout page when user signs out', async ({ homePage, signedOutPage, loginPage }) => {
    await loginPage.signInWith(UserType.NO_VO_USER_NAME)
    await homePage.checkOnPage('Book a visit')
    await homePage.signOut()

    await signedOutPage.checkOnPage('You have signed out')
    await signedOutPage.navigateToLoginPage()

    await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
    await loginPage.goToSignInPage()
    await loginPage.signInWith(UserType.USER_NAME)

    await homePage.checkOnPage('Book a visit')
    expect(await homePage.startBookingButtonIsVisible()).toBeTruthy()
  })
})
