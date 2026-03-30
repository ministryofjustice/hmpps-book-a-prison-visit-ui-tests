import { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export default class BookingConfirmationPage extends BasePage {
  private readonly bookingConfirmation: Locator
  private readonly referenceNumber: Locator
  private readonly visitDetails: Locator
  private readonly contactPrison: Locator
  private readonly cancelVisitLink: Locator
  private readonly requestReference :Locator

  constructor(page: any) {
    super(page)
    this.bookingConfirmation = this.page.locator('[class$=confirmation]')
    this.referenceNumber = this.page.getByTestId('visit-reference-title')
    this.visitDetails = this.page.getByTestId('prison-specific-content')
    this.contactPrison = this.page.getByTestId('contact-prison')
    this.cancelVisitLink = page.getByRole('link', { name: 'the visits page' })
    this.requestReference = this.page.getByTestId('request-reference')

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

  async getContactPrison(): Promise<string> {
    return await this.contactPrison.innerText()
  }

  async clickCancelBooking(): Promise<void> {
    await this.cancelVisitLink.click()
  }
  
  async getRequestRefNumber(): Promise<string> {
    return await this.requestReference.innerText()
  }

}
