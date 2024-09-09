import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class BookingsPage extends BasePage {
  private readonly confirmedBookings: Locator
  private readonly bookingDate: Locator
  private readonly bookingStartTime: Locator
  private readonly bookingEndTime: Locator
  private readonly bookingReference: Locator
  private readonly noBookingsMessage: Locator
  private readonly bookingDetailsLink: Locator
  private readonly viewCancelledVisitsLink: Locator

  constructor(page: Page) {
    super(page)
    this.confirmedBookings = page.locator('[class^=bookings-content]')
    this.bookingDate = page.getByTestId('visit-date-1')
    this.bookingStartTime = page.getByTestId('visit-start-time-1')
    this.bookingEndTime = page.getByTestId('visit-end-time-1')
    this.bookingReference = page.getByTestId('visit-reference-1')
    this.noBookingsMessage = page.getByTestId('no-visits')
    this.bookingDetailsLink = page.getByTestId('visit-link-1')
    this.viewCancelledVisitsLink = page.getByTestId('cancelled-visits-link')
  }

  async getConfirmedBookingsCount(): Promise<number> {
    return await this.confirmedBookings.count()
  }

  async getBookingDate(): Promise<string> {
    return await this.bookingDate.innerText()
  }

  async getBookingStartTime(): Promise<string> {
    return await this.bookingStartTime.textContent()
  }

  async getBookingEndTime(): Promise<string> {
    return await this.bookingEndTime.textContent()
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
}
