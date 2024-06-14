import { Page, Locator, expect } from '@playwright/test'

export abstract class BasePage {
  protected readonly page: Page
  private readonly pageHeader: Locator
  protected readonly continueButton: Locator
  private readonly signOutLink: Locator

  constructor(page: Page) {
    this.page = page
    this.pageHeader = page.locator('#main-content h1')
    this.continueButton = page.getByRole('button', { name: 'Continue' })
    this.signOutLink = page.locator('a[name="Sign out"]')
  }

  async checkOnPage(title: string): Promise<void> {
    await this.pageHeader.waitFor()
    const text = await this.pageHeader.textContent()
    expect(text).toBe(title)
  }

  async signOut() {
    await this.signOutLink.click()
  }

  async navigateTo(url: string) {
    await this.page.goto(url)
    await this.waitForOneLoginPageToLoad()
  }

  private async waitForOneLoginPageToLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  protected async waitForTimeout(timeout: number) {
    await this.page.waitForTimeout(timeout)
  }
}
