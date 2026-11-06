import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export default class SelectPrisonerPage extends BasePage {
  private readonly prisonerCheckboxes: Locator
  
  constructor(page: Page) {
    super(page)
    this.prisonerCheckboxes = page.locator('input[name="prisonerDisplayId"]')
  }

  async selectFirstPrisoner(): Promise<void> {
    const firstCheckbox = this.prisonerCheckboxes.first()
    await firstCheckbox.check()
    expect(await firstCheckbox.isChecked()).toBeTruthy()
  }
}
