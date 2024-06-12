import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class MainContactPage extends BasePage {
  private readonly mainContactRadio: Locator
  private readonly someoneElseRadio: Locator
  private readonly ukPhoneNumberRadio: Locator
  private readonly noPhoneNumberProvidedRadio: Locator
  private readonly someoneElseName: Locator
  private readonly ukPhoneNumber: Locator

  constructor(page: Page) {
    super(page)
    this.mainContactRadio = page.locator("input[name='contact']:not([value='someoneElse'])")
    this.someoneElseRadio = page.getByRole('radio', { name: 'Someone else' })
    this.ukPhoneNumberRadio = page.getByRole('radio', { name: 'UK phone number' })
    this.noPhoneNumberProvidedRadio = page.getByRole('radio', { name: 'No phone number provided' })
    this.someoneElseName = page.getByRole('textbox', { name: 'Name' })
    this.ukPhoneNumber = page.getByRole('textbox', { name: 'Number' })
  }

  async selectMainContact() {
    await this.mainContactRadio.click()
  }

  async selectSomeoneElse(name: string) {
    await this.someoneElseRadio.click()
    await this.someoneElseName.fill(name)
  }

  async selectUKPhoneNumber(phoneNumber: string) {
    await this.ukPhoneNumberRadio.click()
    await this.ukPhoneNumber.fill(phoneNumber)
  }

  async selectNoPhoneNumberProvided() {
    await this.noPhoneNumberProvidedRadio.click()
  }

  async continue() {
    await this.continueButton.click()
  }
}
