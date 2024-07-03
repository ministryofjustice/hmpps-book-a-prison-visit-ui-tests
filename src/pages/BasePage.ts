import { Page, Locator, expect } from '@playwright/test'

export abstract class BasePage {
  protected readonly page: Page
  private readonly pageHeader: Locator
  protected readonly continueButton: Locator
  private readonly signOutLink: Locator
  private readonly alertErrorMessage: Locator
  private readonly homePageLink: Locator
  private readonly bookingsPageLink: Locator

  constructor(page: Page) {
    this.page = page
    this.pageHeader = page.locator('#main-content h1')
    this.continueButton = page.getByRole('button', { name: 'Continue' })
    this.signOutLink = page.locator('a[name="Sign out"]')
    this.alertErrorMessage = page.locator('div[role="alert"]')
    this.homePageLink = page.getByRole('link', { name: 'Home' })
    this.bookingsPageLink = page.locator('[class^=service-header] a:has-text("Bookings")')
  }

  async checkOnPage(title: string): Promise<void> {
    await this.pageHeader.waitFor()
    const text = (await this.pageHeader.textContent()).trim().replace(/\s/g, ' ')
    expect(text).toBe(title)
  }

  async signOut() {
    await this.signOutLink.click()
  }

  async navigateToHomePage() {
    await this.homePageLink.click()
  }

  async navigateToBookingsPage() {
    await this.bookingsPageLink.click()
  }

  async navigateTo(url: string) {
    await this.page.goto(url)
    await this.waitForPageToLoad()
  }

  private async waitForPageToLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout)
  }

  async continueToNextPage() {
    await this.continueButton.click()
  }

  async pause() {
    await this.page.pause()
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    await this.page.waitForLoadState()
    return await this.alertErrorMessage.isVisible()
  }

  async getAlertErrorMessage(): Promise<string> {
    return (await this.alertErrorMessage.locator('a').allInnerTexts()).join(' ')
  }
}
