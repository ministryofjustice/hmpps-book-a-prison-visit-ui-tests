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
  }

  async getAllTheVisitorsNames(): Promise<string[]> {
    const checkedCheckboxes = await this.page.$$('input[type="checkbox"]:checked + label')
    const labels = await Promise.all(checkedCheckboxes.map(checkbox => checkbox.innerText()))
    return labels
  }
}
