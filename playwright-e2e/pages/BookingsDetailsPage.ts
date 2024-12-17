import { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export default class BookingsDetailsPage extends BasePage {
  private readonly visitReferenceNumber: Locator
  private readonly visitDate: Locator
  private readonly visitStartTime: Locator
  private readonly visitEndTime: Locator
  private readonly prisonerName: Locator
  private readonly visitorsNames: Locator
  private readonly additionalSupportRequest: Locator
  private readonly mainContactName: Locator
  private readonly mainContactPhoneNumber: Locator

  constructor(page: any) {
    super(page)
    this.visitReferenceNumber = this.page.getByTestId('booking-reference')
    this.visitDate = this.page.getByTestId('visit-date')
    this.visitStartTime = this.page.getByTestId('visit-start-time')
    this.visitEndTime = this.page.getByTestId('visit-end-time')
    this.prisonerName = this.page.getByTestId('prisoner-name')
    this.visitorsNames = this.page.locator('[data-test^=visitor-name]')
    this.additionalSupportRequest = this.page.getByTestId('additional-support')
    this.mainContactName = this.page.getByTestId('main-contact-name')
    this.mainContactPhoneNumber = this.page.getByTestId('main-contact-number')
  }

  async getVisitReferenceNumber(): Promise<string> {
    return await this.visitReferenceNumber.innerText()
  }

  async getVisitDate(): Promise<string> {
    return await this.visitDate.innerText()
  }

  async getVisitStartTime(): Promise<string> {
    return await this.visitStartTime.innerText()
  }

  async getVisitEndTime(): Promise<string> {
    return await this.visitEndTime.innerText()
  }

  async getPrisonerName(): Promise<string> {
    return await this.prisonerName.innerText()
  }

  async getVisitorsNames(): Promise<string[]> {
    return await this.visitorsNames.allInnerTexts()
  }

  async getAdditionalSupportRequest(): Promise<string> {
    return await this.additionalSupportRequest.innerText()
  }

  async getMainContactName(): Promise<string> {
    return await this.mainContactName.innerText()
  }

  async getMainContactPhoneNumber(): Promise<string> {
    return await this.mainContactPhoneNumber.innerText()
  }
}
