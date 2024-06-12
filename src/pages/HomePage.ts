import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class HomePage extends BasePage {
  private readonly prisonerName: Locator
  private readonly startButton: Locator

  constructor(page: Page) {
    super(page)
    this.prisonerName = page.getByTestId('prisoner-name')
    this.startButton = page.getByTestId('start-booking')
  }

  async getPrisonerName() {
    return this.prisonerName.innerText()
  }

  async startBooking() {
    await this.startButton.click()
  }
}
