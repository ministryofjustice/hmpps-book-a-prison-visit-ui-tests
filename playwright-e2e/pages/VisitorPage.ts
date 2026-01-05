import { Locator, Page, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export default class VisitorPage extends BasePage {
  private readonly visitorCheckboxes: Locator
  private readonly formErrorMessage: Locator
  private readonly addNewVisitorLink: Locator
  private readonly addNewVisitorFormLink: Locator

  constructor(page: Page) {
    super(page)
    this.visitorCheckboxes = page.locator('input[type="checkbox"]')
    this.formErrorMessage = page.locator('[class$=error-message]')
    this.addNewVisitorLink = page.locator('[class$=details] summary')
    this.addNewVisitorFormLink = page.locator('a:has-text("complete the form")')
  }

  async selectFirstVisitor(): Promise<void> {
    const firstCheckbox = this.visitorCheckboxes.first()
    await firstCheckbox.check()
    expect(await firstCheckbox.isChecked()).toBeTruthy()
  }

  async selectLastVisitor(): Promise<void> {
    const lastCheckbox = this.visitorCheckboxes.last()
    await lastCheckbox.check()
    expect(await lastCheckbox.isChecked()).toBeTruthy()
  }

  async selectVisitors(numberOfVisitors: number): Promise<void> {
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

  async getAllTheVisitorsNamesWithAge(): Promise<string[]> {
    const checkedCheckboxes = await this.page.$$('input[type="checkbox"]:checked + label')
    const labels = await Promise.all(checkedCheckboxes.map(checkbox => checkbox.innerText()))
    return labels
  }

  async getAllTheVisitorsNames(): Promise<string[]> {
    this.page.waitForTimeout(1000)
    const checkedCheckboxes = await this.page.$$('input[type="checkbox"]:checked + label')
    const labels = await Promise.all(
      checkedCheckboxes.map(checkbox => checkbox.innerText().then(text => text.split('(')[0].trim())),
    )
    return labels
  }

  async getFormErrorMessage(): Promise<string> {
    return await this.formErrorMessage.textContent()
  }

  async addNewVisitor(): Promise<void> {
    await this.addNewVisitorLink.click()
    await this.addNewVisitorFormLink.click()
  }

  async verifyVisitorDetails(name: string, dob: string, canBook: string): Promise<void> {
    const row = this.page.locator('tr', { hasText: name })
    await expect(row).toContainText(dob)
    await expect(row).toContainText(canBook)
  }

  async selectVisitorUnder18(): Promise<void> {
    const labels = this.page.locator('.govuk-checkboxes__label')
    const count = await labels.count()

    for (let i = 0; i < count; i++) {
      const label = labels.nth(i)
      const text = await label.innerText()

      // Extract the age from the label text
      const match = text.match(/\((\d+)\s*years?\s*old\)/)

      if (match && Number(match[1]) < 18) {
        await label.click()

        const inputId = await label.getAttribute('for')
        const checkbox = this.page.locator(`#${inputId}`)
        await expect(checkbox).toBeChecked()
        return
      }
    }

    throw new Error('No under-18 visitor found')
  }

}
