import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class ContactDetailsPage extends BasePage {
    private readonly contactEmailCheckbox: Locator
    private readonly contactEmailInput: Locator
    private readonly contactPhoneNum: Locator
    private readonly contactPhoneNumInput: Locator

    constructor(page: Page) {
        super(page)
        this.contactEmailCheckbox = page.getByLabel('Get updates by email')
        this.contactPhoneNum = page.getByLabel('Get updates by phone')
        this.contactEmailInput = page.locator('input[id$=mainContactEmail]')
        this.contactPhoneNumInput = page.locator('input[id$=mainContactPhone]')
    }

    async enterEmailAdd(): Promise<void> {
        await this.contactEmailCheckbox.check()
        await this.contactEmailInput.fill('test@example.com')
    }

    async enterPhoneNumber(): Promise<void> {
        await this.contactPhoneNum.check()
        await this.contactPhoneNumInput.fill('07712345678')
    }

}

