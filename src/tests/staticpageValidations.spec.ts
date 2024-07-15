import { expect, test } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
  GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Static page validations', () => {
  test('should take the user to feedback page', async ({ context, loginPage, homePage }) => {
    await loginPage.navigateTo('/')
    await homePage.checkOnPage('Book a visit')

    const waitForFeedbackPage = context.waitForEvent('page')
    await homePage.navigateToFeedbackPage()
    const feedbackPage = await waitForFeedbackPage
    const header = feedbackPage.locator('#main-content h1')
    expect(await header.textContent()).toContain('Visit someone in prison - feedback')
  })

  test('should take the user to accessibility statement page', async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/')
    await homePage.checkOnPage('Book a visit')

    await homePage.navigateToAccessibilityStatementPage()
    await homePage.checkOnPage('Accessibility statement')

    expect(await homePage.doesUrlContain('accessibility-statement')).toBeTruthy()
  })

  test('should take the user to privacy policy page', async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/')
    await homePage.checkOnPage('Book a visit')

    await homePage.navigateToPrivacyPolicyPage()
    await homePage.checkOnPage('Privacy notice')

    expect(await homePage.doesUrlContain('privacy-notice')).toBeTruthy()
  })

  test('should take the user to terms and conditions page', async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/')
    await homePage.checkOnPage('Book a visit')

    await homePage.navigateToTermsAndConditionsPage()
    await homePage.checkOnPage('Terms and conditions')

    expect(await homePage.doesUrlContain('terms-and-conditions')).toBeTruthy()
  })

  test('should open a new form to add a new visitor', async ({ context, loginPage, homePage, visitorPage }) => {
    await loginPage.navigateTo('/')
    await homePage.checkOnPage('Book a visit')
    await homePage.startBooking()

    const addNewVisitorForm = context.waitForEvent('page')
    await visitorPage.addNewVisitor()
    const newVisitorPage = await addNewVisitorForm
    const pageHeader = newVisitorPage.locator('#main-content h1')
    expect(await pageHeader.textContent()).toContain('Visit someone in prison - add a visitor')
  })
})
