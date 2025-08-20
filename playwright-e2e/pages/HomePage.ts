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
  private readonly addPrisoner: Locator

  constructor(page: Page) {
    super(page)
    this.prisonerName = page.getByTestId('prisoner-name')
    this.startButton = page.getByTestId('start-booking')
    this.cancelBookingRadio = page.getByRole('radio', { name: 'Yes, cancel this visit' })
    this.keepBookingRadio = page.getByRole('radio', { name: 'No, keep this visit' })
    this.confirmButton = page.getByTestId('confirm-button')
    this.confirmationMessage = page.locator('[id$=main-content]')
    this.bookingRefNUmber = page.getByTestId('booking-reference')
    this.addPrisoner = page.getByTestId('add-prisoner')
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

  async clickOnAddPrisoner(): Promise<void> {
    await this.addPrisoner.click()
  }

  async selectPrisonFromList(prisonName: string): Promise<void> {
    const prisonRadio = this.page.locator(`input[type="radio"][name="prisonId"][value="${prisonName}"]`)
    await prisonRadio.waitFor({ state: 'visible' }) // ensure it's in view
    await prisonRadio.check()
  }
  // Utility
  async setAuthCookiesInStorage(path: string): Promise<void> {
    await this.page.context().storageState({ path })
  }
}