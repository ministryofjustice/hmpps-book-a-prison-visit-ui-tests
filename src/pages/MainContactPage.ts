import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class MainContactPage extends BasePage {
  private readonly mainContactRadio: Locator
  private readonly someoneElseRadio: Locator
  private readonly ukPhoneNumberRadio: Locator
  private readonly noPhoneNumberProvidedRadio: Locator
  private readonly someoneElseName: Locator
  private readonly ukPhoneNumber: Locator
  private readonly formNoContactErrorMessage: Locator
  private readonly formSomeoneElseErrorMessage: Locator
  private readonly formNoNumberErrorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.mainContactRadio = page.locator("input[name='contact']:not([value='someoneElse'])")
    this.someoneElseRadio = page.getByRole('radio', { name: 'Someone else' })
    this.ukPhoneNumberRadio = page.getByRole('radio', { name: 'UK phone number' })
    this.noPhoneNumberProvidedRadio = page.getByRole('radio', { name: 'No phone number provided' })
    this.someoneElseName = page.getByRole('textbox', { name: 'Name' })
    this.ukPhoneNumber = page.getByRole('textbox', { name: 'Number' })
    this.formNoContactErrorMessage = page.locator('[id$=contact-error]')
    this.formSomeoneElseErrorMessage = page.locator('[id$=someoneElseName-error]')
    this.formNoNumberErrorMessage = page.locator('[id$=Number-error]')
  }

  async selectMainContact(): Promise<void> {
    await this.mainContactRadio.first().click()
  }

  async selectSomeoneElse(name: string): Promise<void> {
    await this.someoneElseRadio.click()
    await this.someoneElseName.fill(name)
  }

  async isSomeoneElseNameInputboxVisible(): Promise<boolean> {
    return await this.someoneElseName.isVisible()
  }

  async selectUKPhoneNumber(phoneNumber: string): Promise<void> {
    await this.ukPhoneNumberRadio.click()
    await this.ukPhoneNumber.fill(phoneNumber)
  }

  async selectNoPhoneNumberProvided(): Promise<void> {
    await this.noPhoneNumberProvidedRadio.click()
  }

  async getMainContactName(): Promise<string> {
    const selectedContact = await this.page.$('input[name="contact"]:not([value=\'someoneElse\']):checked + label')
    return await selectedContact.innerText()
  }

  async getPhoneNumber(): Promise<string> {
    const phoneNumber = await this.page.$('input[name="hasPhoneNumber"]:checked + label')
    return await phoneNumber.innerText()
  }

  async getFormNoContactErrorMessage(): Promise<string> {
    return await this.formNoContactErrorMessage.textContent()
  }

  async getFormSomeoneElseErrorMessage(): Promise<string> {
    return await this.formSomeoneElseErrorMessage.textContent()
  }

  async getFormNoNumberErrorMessage(): Promise<string> {
    return await this.formNoNumberErrorMessage.textContent()
  }
}
