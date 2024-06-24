import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class VisitsCalendarPage extends BasePage {
  private readonly calendarDate: Locator
  private readonly calendarTime: Locator
  private readonly formErrorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.calendarDate = page.locator('a[id^=day-link]')
    this.calendarTime = page.locator('input[type=radio]')
    this.formErrorMessage = page.locator('[class$= active] [class$=error-message]')
  }

  async selectFirstAvailableDate() {
    await this.calendarDate.first().click()
  }

  async selectFirstAvailableTime() {
    await this.calendarTime.first().click()
  }

  async getSelectedDate(): Promise<string> {
    const dateSelected = await this.page.$('[class$=day-group--active] legend')
    return (await dateSelected.innerText()).trim()
  }

  async getSelectedTime(): Promise<string> {
    const time = await this.page.$('input[type=radio]:checked + label')
    const timeSlot = await time.innerText()
    return timeSlot.split('(')[0].trim()
  }

  async getFormErrorMessage(): Promise<string> {
    return await this.formErrorMessage.textContent()
  }
}
