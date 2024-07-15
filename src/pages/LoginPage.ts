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

  async signIntoBookVisitsService(): Promise<void> {
    await this.emailInput.fill(process.env.USER_NAME || '')
    await this.continueButton.click()
    await this.passwordInput.fill(process.env.PASSWORD || '')
    await this.continueButton.click()
  }

  async signInWithANewUser(): Promise<void> {
    await this.emailInput.fill(process.env.NEW_USER_NAME || '')
    await this.continueButton.click()
    await this.passwordInput.fill(process.env.NEW_PASSWORD || '')
    await this.continueButton.click()
  }

  async signAsUnknownBooker(): Promise<void> {
    await this.emailInput.fill(process.env.UNKNOWN_USER_NAME || '')
    await this.continueButton.click()
    await this.passwordInput.fill(process.env.PASSWORD || '')
    await this.continueButton.click()
  }

  async signAsAUserWithNoVOBalance(): Promise<void> {
    await this.emailInput.fill(process.env.NO_VO_USER_NAME || '')
    await this.continueButton.click()
    await this.passwordInput.fill(process.env.PASSWORD || '')
    await this.continueButton.click()
  }

  goToSignInPage = async () => {
    await this.signInButton.click()
  }
}
