import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class BookingsPage extends BasePage {
  private readonly confirmedBookings: Locator
  private readonly bookingDate: Locator
  private readonly bookingStartEndTime: Locator
  private readonly bookingReference: Locator
  private readonly noBookingsMessage: Locator
  private readonly bookingDetailsLink: Locator
  private readonly viewCancelledVisitsLink: Locator
  private readonly cancelBookingLink: Locator

  constructor(page: Page) {
    super(page)
    this.confirmedBookings = page.locator('[class^=visits-content]')
    this.bookingDate = page.getByTestId('visit-date-1')
    this.bookingStartEndTime = page.getByTestId('visit-start-end-time-1')
    this.bookingReference = page.getByTestId('visit-reference-1')
    this.noBookingsMessage = page.getByTestId('no-visits')
    this.bookingDetailsLink = page.getByTestId('visit-link-1')
    this.viewCancelledVisitsLink = page.getByTestId('cancelled-visits-link')
    this.cancelBookingLink = page.getByTestId('visit-link-cancel-1')

  }

  async getConfirmedBookingsCount(): Promise<number> {
    return await this.confirmedBookings.count()
  }

  async getBookingDate(): Promise<string> {
    return await this.bookingDate.innerText()
  }

  async getBookingStartEndTime(): Promise<string> {
    return await this.bookingStartEndTime.textContent()
  }

  async getBookingReference(): Promise<string> {
    return await this.bookingReference.textContent()
  }

  async isNoBookingsMessageDisplayed(): Promise<boolean> {
    return await this.noBookingsMessage.isVisible()
  }

  async getNoBookingsMessage(): Promise<string> {
    return await this.noBookingsMessage.textContent()
  }

  async clickBookingDetailsLink(): Promise<void> {
    await this.bookingDetailsLink.click()
  }

  async clickViewCancelledVisitsLink(): Promise<void> {
    await this.viewCancelledVisitsLink.click()
  }
  async clickCancelBookingLink(): Promise<void> {
    await this.cancelBookingLink.click()
  }

}
