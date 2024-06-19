import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class AdditionalSupportPage extends BasePage {
  private readonly additionalSupportRequiredRadio: Locator
  private readonly noAdditionalSupportRequiredRadio: Locator
  private readonly additionalSupportDetailsInputbox: Locator

  constructor(page: Page) {
    super(page)
    this.additionalSupportRequiredRadio = page.getByRole('radio', { name: 'Yes' })
    this.noAdditionalSupportRequiredRadio = page.getByRole('radio', { name: 'No' })
    this.additionalSupportDetailsInputbox = page.getByRole('textbox', { name: 'Provide details' })
  }

  async selectNoSupport() {
    await this.noAdditionalSupportRequiredRadio.click()
  }

  async selectSupport(details: string) {
    await this.additionalSupportRequiredRadio.click()
    await this.additionalSupportDetailsInputbox.fill(details)
  }

  async getApplicationReference(): Promise<string> {
    return this.continueButton.getAttribute('data-test-app-ref')
  }
}
