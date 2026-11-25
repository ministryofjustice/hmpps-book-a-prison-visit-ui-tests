import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class HomePage extends BasePage {
  private readonly startButton: Locator
  private readonly cancelBookingRadio: Locator
  private readonly keepBookingRadio: Locator
  private readonly confirmButton: Locator
  private readonly confirmationMessage: Locator
  private readonly bookingRefNUmber: Locator
  private readonly addPrisoner: Locator

  constructor(page: Page) {
    super(page)
    this.startButton = page.getByTestId('book-a-visit')
    this.cancelBookingRadio = page.getByRole('radio', { name: 'Yes, cancel this visit' })
    this.keepBookingRadio = page.getByRole('radio', { name: 'No, keep this visit' })
    this.confirmButton = page.getByTestId('confirm-button')
    this.confirmationMessage = page.locator('[id$=main-content]')
    this.bookingRefNUmber = page.getByTestId('visit-reference')
    this.addPrisoner = page.getByTestId('add-prisoner')
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
  async selectKeepThisBooking(): Promise<void> {
    await this.keepBookingRadio.click()
  }

  async getBookingRefNumber(): Promise<string> {
    return this.bookingRefNUmber.innerText()
  }

  async clickOnAddPrisoner(): Promise<void> {
    await this.addPrisoner.click()
  }

  async autoCompletePrisonName(prisonName: string): Promise<void> {
    // The combobox only exists once accessible-autocomplete has enhanced the <select>
    const prisonInput = this.page.locator('input#prisonId[role="combobox"]')
    await prisonInput.fill(prisonName)

    const option = this.page.locator('#prisonId__listbox').getByRole('option', { name: prisonName })
    await option.waitFor({ state: 'visible' })
    await option.click()
  }
  // Utility
  async setAuthCookiesInStorage(path: string): Promise<void> {
    await this.page.context().storageState({ path })
  }
}