import { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export default class VisitDetailsPage extends BasePage {
  private readonly prisonerNameLabel: Locator
  private readonly visitorsNames: Locator
  private readonly visitDateAndTime: Locator
  private readonly additionalSupportDetails: Locator
  private readonly mainsContactName: Locator
  private readonly submitBookingButton: Locator
  private readonly changeVisitorsLink: Locator
  private readonly changeDateTimeLink: Locator
  private readonly changeAdditionalSupportLink: Locator
  private readonly changeMainContactLink: Locator

  constructor(page: any) {
    super(page)
    this.prisonerNameLabel = this.page.locator('dl dt:has-text("Prisoner") + dd')
    this.visitorsNames = this.page.locator('dl dt:has-text("Visitors") + dd')
    this.visitDateAndTime = this.page.locator('dl dt:has-text("Date and time") + dd')
    this.additionalSupportDetails = this.page.locator('dl dt:has-text("Additional support requests") + dd p')
    this.mainsContactName = this.page.locator('dl dt:has-text("Main contact") + dd')
    this.submitBookingButton = this.page.locator('button:has-text("Submit booking")')
    this.changeVisitorsLink = this.page.getByTestId('change-visitors')
    this.changeDateTimeLink = this.page.getByTestId('change-time')
    this.changeAdditionalSupportLink = this.page.getByTestId('change-additional-support')
    this.changeMainContactLink = this.page.getByTestId('change-main-contact')
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
    return (await this.mainsContactName.locator('p').allInnerTexts()).join(' ')
  }

  async submitBooking(): Promise<void> {
    await this.submitBookingButton.click()
  }

  async changeVisitors(): Promise<void> {
    await this.changeVisitorsLink.click()
  }

  async changeDateTime(): Promise<void> {
    await this.changeDateTimeLink.click()
  }

  async changeAdditionalSupport(): Promise<void> {
    await this.changeAdditionalSupportLink.click()
  }

  async changeMainContact(): Promise<void> {
    await this.changeMainContactLink.click()
  }
}
