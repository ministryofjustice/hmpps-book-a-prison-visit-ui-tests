import { BasePage } from './BasePage'
import { Locator, Page } from '@playwright/test'

export default class LoginPage extends BasePage {
  private readonly signInButton: Locator
  private readonly emailInput: Locator
  private readonly passwordInput: Locator

  constructor(page: Page) {
    super(page)
    this.signInButton = page.getByRole('button', { name: 'Sign in' })
    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
  }

  async signIntoBookVisitsService() {
    await this.emailInput.fill(process.env.USER_NAME || '')
    await this.continueButton.click()
    await this.passwordInput.fill(process.env.PASSWORD || '')
    await this.continueButton.click()
  }

  goToSignInPage = async () => {
    await this.signInButton.click()
  }
}
