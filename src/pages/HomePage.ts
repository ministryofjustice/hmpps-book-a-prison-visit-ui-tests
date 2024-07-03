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

  async getPrisonerName(): Promise<string> {
    return this.prisonerName.innerText()
  }

  async startBooking(): Promise<void> {
    await this.startButton.click()
  }

  async startBookingButtonIsVisible(): Promise<boolean> {
    return this.startButton.isVisible()
  }

  async setAuthCookiesInStorage(path: string): Promise<void> {
    await this.page.context().storageState({ path })
  }
}
