import { Locator, Page } from '@playwright/test'

import { BasePage } from "./BasePage";

export default class VisitRequestedPage extends BasePage {
    private readonly requestReference: Locator
    private readonly reviewMsg: Locator

    constructor(page: Page) {
        super(page)
        this.requestReference = this.page.getByTestId('request-reference')
        this.reviewMsg = this.page.locator('.govuk-panel__body')

    }
    async getRequestRefNumber(): Promise<string> {
        return await this.requestReference.innerText()
    }

    async getReviewMsg(): Promise<string> {
        return await this.reviewMsg.innerText()
    }

    async getPrisonDecisionMessageText(): Promise<string> {
        return await this.page.locator('text=/.*will confirm or reject your request\\./').innerText()
    }

}
