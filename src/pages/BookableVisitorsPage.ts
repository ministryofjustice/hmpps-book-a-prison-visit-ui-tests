import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class BookableVisitorsPage extends BasePage {
    private readonly bookableVisitorsPageHeading: Locator
    private readonly totalBookableVisitors: Locator

    constructor(page: Page) {
        super(page)
        this.bookableVisitorsPageHeading = page.locator('[class^=govuk-heading-l]')
        this.totalBookableVisitors = page.locator('[class^=govuk-table__body]').locator('tr')
    }

    async getPageHeading(): Promise<string> {
        return await this.bookableVisitorsPageHeading.innerText()
    }

    async getVisitorsCount(): Promise<number>{
        return await this.totalBookableVisitors.count()
    }
}

