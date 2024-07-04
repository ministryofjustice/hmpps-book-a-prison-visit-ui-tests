import { expect, test } from '../fixtures/PageFixtures'

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
    await homePage.checkOnPage('Privacy policy')

    expect(await homePage.doesUrlContain('privacy-policy')).toBeTruthy()
  })

  test('should take the user to terms and conditions page', async ({ loginPage, homePage }) => {
    await loginPage.navigateTo('/')
    await homePage.checkOnPage('Book a visit')

    await homePage.navigateToTermsAndConditionsPage()
    await homePage.checkOnPage('Terms and conditions')

    expect(await homePage.doesUrlContain('terms-and-conditions')).toBeTruthy()
  })
})
