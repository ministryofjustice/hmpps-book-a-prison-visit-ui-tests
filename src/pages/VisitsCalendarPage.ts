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
  }

  async getSelectedDate(): Promise<string> {
    const dateSelected = await this.page.$('input[type=radio]:checked')
    const date = await dateSelected.getAttribute('value')
    return date.split('_')[0].trim()
  }

  async getSelectedTime(): Promise<string> {
    const time = await this.page.$('input[type=radio]:checked + label')
    const timeSlot = await time.innerText()
    return timeSlot.split('(')[0].trim()
  }
}
