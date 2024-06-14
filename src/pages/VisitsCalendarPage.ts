import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class VisitsCalendarPage extends BasePage {
  private readonly calendarDate: Locator
  private readonly calendarTime: Locator

  constructor(page: Page) {
    super(page)
    this.calendarDate = page.locator('a[id^=day-link]')
    this.calendarTime = page.locator('input[type=radio]')
  }

  async selectFirstAvailableDate() {
    await this.calendarDate.first().click()
  }

  async selectFirstAvailableTime() {
    await this.calendarTime.first().click()
    await this.continueButton.click()
  }
}
