import { expect, test } from '../../fixtures/PageFixtures'

test('test', async ({ loginPage, homePage }) => {
  await loginPage.navigateTo('/')
  await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
  await loginPage.goToSignInPage()
  await loginPage.signIntoBookVisitsService()

  await homePage.checkOnPage('Book a visit')
  expect(await homePage.startBookingButtonIsVisible()).toBeTruthy()
  await homePage.setAuthCookiesInStorage('playwright/.auth/auth.json')
})
