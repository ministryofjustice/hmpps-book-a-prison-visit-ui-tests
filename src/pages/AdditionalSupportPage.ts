import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class AdditionalSupportPage extends BasePage {
  private readonly additionalSupportRequiredRadio: Locator
  private readonly noAdditionalSupportRequiredRadio: Locator

  constructor(page: Page) {
    super(page)
    this.additionalSupportRequiredRadio = page.getByRole('radio', { name: 'Yes' })
    this.noAdditionalSupportRequiredRadio = page.getByRole('radio', { name: 'No' })
  }

  async selectNoSupport() {
    await this.noAdditionalSupportRequiredRadio.click()
    await this.continueButton.click()
  }

  async selectSupport() {
    await this.additionalSupportRequiredRadio.click()
    await this.continueButton.click()
  }
}
