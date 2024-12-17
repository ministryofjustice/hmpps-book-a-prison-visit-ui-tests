import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class SignedOutPage extends BasePage {
  private readonly logingBackLink: Locator

  constructor(page: Page) {
    super(page)
    this.logingBackLink = page.getByRole('link', { name: 'signing into the service using GOV.UK One Login' })
  }

  async isSigninBackLinkVisible(): Promise<boolean> {
    return await this.logingBackLink.isVisible()
  }

  async navigateToLoginPage(): Promise<void> {
    await this.logingBackLink.click()
  }
}
