import { BasePage } from './BasePage'
import { Locator, Page } from '@playwright/test'
import { UserType } from '../support/UserType'

export default class LoginPage extends BasePage {
  private readonly signInButton: Locator
  private readonly emailInput: Locator
  private readonly passwordInput: Locator
  private readonly startNowButton: Locator

  constructor(page: Page) {
    super(page)
    this.startNowButton = page.getByRole('button', { name: 'Start now' })
    this.signInButton = page.getByRole('button', { name: 'Sign in' })
    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
  }

  async signInWith(userName: UserType): Promise<void> {
    await this.emailInput.fill(await this.getUserName(userName), { timeout: 60000 })
    await this.continueButton.click()
    await this.passwordInput.fill(process.env.PASSWORD || '', { timeout: 60000 })
    await this.continueButton.click()
  }

  private async getUserName(userType: UserType): Promise<string> {
    let userName
    switch (userType) {
      case UserType.USER_NAME:
        userName = process.env.USER_NAME || ''
        break
      case UserType.NEW_USER_NAME:
        userName = process.env.NEW_USER_NAME || ''
        break
      case UserType.UNKNOWN_USER_NAME:
        userName = process.env.UNKNOWN_USER_NAME || ''
        break
      case UserType.NO_VO_USER_NAME:
        userName = process.env.NO_VO_USER_NAME || ''
        break
      case UserType.ONE_VO_BALANCE_USER_NAME:
        userName = process.env.ONE_VO_BALANCE_USER_NAME || ''
        break
      case UserType.REMAND_PRISONER_VISITOR:
        userName = process.env.REMAND_PRISONER_VISITOR || ''
        break
      case UserType.USER_WITH_NO_PRISONERS:
        userName = process.env.USER_WITH_NO_PRISONERS || ''
        break
      case UserType.USER_WITH_PRISONER_ALERTS:
        userName = process.env.USER_WITH_PRISONER_ALERTS || ''
        break
      case UserType.USER_WITH_PRISONER_RESTRICTIONS:
        userName = process.env.USER_WITH_PRISONER_RESTRICTIONS || ''
        break 
       case UserType.USER_WITH_VISITOR_RESTRICTIONS:
        userName = process.env.USER_WITH_VISITOR_RESTRICTIONS || ''
        break     

    }

    return userName
  }

  goToSignInPage = async () => {
    await this.signInButton.click()
  }

  clickStartNowButton = async () => {
    await this.startNowButton.click()
  }
}
