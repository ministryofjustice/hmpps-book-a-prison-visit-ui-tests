import { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export default class BookingConfirmationPage extends BasePage {
  private readonly bookingConfirmation: Locator
  private readonly referenceNumber: Locator
  private readonly visitDetails: Locator

  constructor(page: any) {
    super(page)
    this.bookingConfirmation = this.page.locator('[class$=confirmation]')
    this.referenceNumber = this.page.getByTestId('booking-reference')
    this.visitDetails = this.page.getByTestId('prison-specific-content')
  }

  async isBookingConfirmationDisplayed(): Promise<boolean> {
    return await this.bookingConfirmation.isVisible()
  }

  async getReferenceNumber(): Promise<string> {
    return await this.referenceNumber.innerText()
  }

  async isVisitDetailsDisplayed(): Promise<boolean> {
    return await this.visitDetails.isVisible()
  }
}
