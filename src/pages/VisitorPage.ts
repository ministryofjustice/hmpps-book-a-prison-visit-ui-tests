import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export default class VisitorPage extends BasePage {
  private readonly visitorCheckboxes: Locator

  constructor(page: Page) {
    super(page)
    this.visitorCheckboxes = page.locator('input[type="checkbox"]')
  }

  async selectFirstVisitor() {
    const firstCheckbox = this.visitorCheckboxes.first()
    await firstCheckbox.check()
    expect(await firstCheckbox.isChecked()).toBeTruthy()
    await this.continueButton.click()
  }

  async selectVisitors(numberOfVisitors: number) {
    try {
      for (let i = 0; i < numberOfVisitors; i++) {
        const checkbox = this.visitorCheckboxes.nth(i)
        await checkbox.check()
        expect(await checkbox.isChecked()).toBeTruthy()
      }
    } catch (error) {
      console.error('Error while selecting the visitor: ', error)
    }
    await this.continueButton.click()
  }
}
