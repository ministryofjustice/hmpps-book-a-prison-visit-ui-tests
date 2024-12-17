import { expect, test } from '../../fixtures/PageFixtures'
import { UserType } from '../../support/UserType'

test('test', async ({ loginPage, homePage }) => {
  await loginPage.navigateTo('/')
  await loginPage.checkOnPage('Visit someone in prison')
  await loginPage.clickStartNowButton()
  await loginPage.goToSignInPage()
  await loginPage.signInWith(UserType.USER_NAME)

  await homePage.checkOnPage('Book a visit')
  expect(await homePage.startBookingButtonIsVisible()).toBeTruthy()
  await homePage.setAuthCookiesInStorage('playwright/.auth/auth.json')
})
