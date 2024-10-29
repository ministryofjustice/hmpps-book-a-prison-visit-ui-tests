import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class HomePage extends BasePage {
  private readonly prisonerName: Locator
  private readonly startButton: Locator
  private readonly cancelBookingRadio: Locator
  private readonly keepBookingRadio: Locator
  private readonly confirmButton: Locator
  private readonly confirmationMessage: Locator
  private readonly bookingRefNUmber: Locator

  constructor(page: Page) {
    super(page)
    this.prisonerName = page.getByTestId('prisoner-name')
    this.startButton = page.getByTestId('start-booking')
    this.cancelBookingRadio = page.getByRole('radio', { name: 'Yes, cancel this booking' })
    this.keepBookingRadio = page.getByRole('radio', { name: 'No, keep this booking' })
    this.confirmButton = page.getByTestId('confirm-button')
    this.confirmationMessage = page.locator('[id$=main-content]')
    this.bookingRefNUmber = page.getByTestId('booking-reference')
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

  async cancelBooking(): Promise<void> {
    await this.cancelBookingRadio.click()
  }

  async clickConfirm(): Promise<void> {
    await this.confirmButton.click()
  }

  async getConfirmationMessage(): Promise<string> {
    return this.confirmationMessage.innerText()
  }
  async selectKeepThislBooking(): Promise<void> {
    await this.keepBookingRadio.click()
  }

  async getBookingRefNumber(): Promise<string> {
    return this.bookingRefNUmber.innerText()
  }

}
