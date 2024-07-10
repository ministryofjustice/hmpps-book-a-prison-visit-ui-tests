import { Page, Locator, expect } from '@playwright/test'
import GlobalData from '../setup/GlobalData'

let deviceName: string | undefined

export abstract class BasePage {
  protected readonly page: Page
  private readonly pageHeader: Locator
  protected readonly continueButton: Locator
  private readonly signOutLink: Locator
  private readonly alertErrorMessage: Locator
  private readonly homePageLink: Locator
  private readonly bookingsPageLink: Locator
  private readonly feedbackLink: Locator
  private readonly accessibilityStatementLink: Locator
  private readonly privacyPolicyLink: Locator
  private readonly termsAndConditionsLink: Locator
  private readonly mobileOneLoginMenuButton: Locator
  private readonly mobileNavMenuButton: Locator

  constructor(page: Page) {
    this.page = page
    deviceName = GlobalData.get('deviceName')
    this.pageHeader = page.locator('#main-content h1')
    this.continueButton = page.getByRole('button', { name: 'Continue' })
    this.signOutLink = page.getByRole('link', { name: 'Sign out' })
    this.alertErrorMessage = page.locator('div[role="alert"]')
    this.homePageLink = page.getByRole('link', { name: 'Home' })
    this.bookingsPageLink = page.locator('[class^=service-header] a:has-text("Bookings")')
    this.feedbackLink = page.getByRole('link', { name: 'feedback' })
    this.accessibilityStatementLink = page.getByRole('link', { name: 'Accessibility' })
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy' })
    this.termsAndConditionsLink = page.getByRole('link', { name: 'Terms and conditions' })
    this.mobileOneLoginMenuButton = page.getByRole('button', { name: 'Show GOV.UK One Login menu' })
    this.mobileNavMenuButton = page.getByRole('button', { name: 'Show service navigation menu' })
  }

  async checkOnPage(title: string): Promise<void> {
    await this.pageHeader.waitFor()
    const text = (await this.pageHeader.textContent()).trim().replace(/\s/g, ' ')
    expect(text).toBe(title)
  }

  async signOut(): Promise<void> {
    if (deviceName.includes('mobile')) {
      await this.mobileOneLoginMenuButton.click()
      await this.signOutLink.click()
    } else {
      await this.signOutLink.click()
    }
  }

  async navigateToHomePage(): Promise<void> {
    if (deviceName.includes('mobile')) {
      await this.mobileNavMenuButton.click()
      await this.homePageLink.click()
    } else {
      await this.homePageLink.click()
    }
  }

  async navigateToBookingsPage(): Promise<void> {
    if (deviceName.includes('mobile')) {
      await this.mobileNavMenuButton.click()
      await this.bookingsPageLink.click()
    } else {
      await this.bookingsPageLink.click()
    }
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url)
    await this.waitForPageToLoad()
  }

  private async waitForPageToLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout)
  }

  async continueToNextPage(): Promise<void> {
    await this.continueButton.click()
  }

  async pause(): Promise<void> {
    await this.page.pause()
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    await this.page.waitForLoadState()
    return await this.alertErrorMessage.isVisible()
  }

  async getAlertErrorMessage(): Promise<string> {
    return (await this.alertErrorMessage.locator('a').allInnerTexts()).join(' ')
  }

  async navigateToFeedbackPage(): Promise<void> {
    await this.feedbackLink.click()
  }

  async navigateToAccessibilityStatementPage(): Promise<void> {
    await this.accessibilityStatementLink.click()
  }

  async navigateToPrivacyPolicyPage(): Promise<void> {
    await this.privacyPolicyLink.click()
  }

  async navigateToTermsAndConditionsPage(): Promise<void> {
    await this.termsAndConditionsLink.click()
  }

  async doesUrlContain(url: string): Promise<boolean> {
    return this.page.url().includes(url)
  }

  async getDeviceName(): Promise<string> {
    return GlobalData.get('deviceName')
  }
}
