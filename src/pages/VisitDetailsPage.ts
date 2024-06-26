import { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export default class VisitDetailsPage extends BasePage {
  private readonly prisonerNameLabel: Locator
  private readonly visitorsNames: Locator
  private readonly visitDateAndTime: Locator
  private readonly additionalSupportDetails: Locator
  private readonly mainsContactName: Locator
  private readonly submitBookingButton: Locator

  constructor(page: any) {
    super(page)
    this.prisonerNameLabel = this.page.locator('dl dt:has-text("Prisoner") + dd')
    this.visitorsNames = this.page.locator('dl dt:has-text("Visitors") + dd')
    this.visitDateAndTime = this.page.locator('dl dt:has-text("Date and time") + dd')
    this.additionalSupportDetails = this.page.locator('dl dt:has-text("Additional support requests") + dd p')
    this.mainsContactName = this.page.locator('dl dt:has-text("Main contact") + dd')
    this.submitBookingButton = this.page.locator('button:has-text("Submit booking")')
  }

  async getPrisonerName(): Promise<string> {
    return await this.prisonerNameLabel.innerText()
  }

  async getAllTheVisitorsNames(): Promise<string[]> {
    return await this.visitorsNames.locator('p').allInnerTexts()
  }

  async getSelectedDateAndTime(): Promise<string[]> {
    return await this.visitDateAndTime.locator('p').allInnerTexts()
  }

  async getAdditionalSupportDetails(): Promise<string> {
    return await this.additionalSupportDetails.innerText()
  }

  async getMainContactName(): Promise<string> {
    return await this.mainsContactName.innerText()
  }

  async submitBooking(): Promise<void> {
    await this.submitBookingButton.click()
  }
}
