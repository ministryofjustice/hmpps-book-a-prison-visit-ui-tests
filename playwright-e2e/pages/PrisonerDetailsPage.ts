import { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export default class PrisonerDetailsPage extends BasePage {
    private readonly prisonerFirstName: Locator
    private readonly prisonerLastName: Locator
    private readonly prisonerNumber: Locator
    private readonly firstNameError: Locator
    private readonly secondNameError: Locator
    private readonly dobError: Locator
    private readonly noPrisonerNumError: Locator
    private readonly dobMonth: Locator
    private readonly dobDay: Locator
    private readonly dobYear: Locator

    constructor(page: Page) {
        super(page)
        this.prisonerFirstName = page.locator('#firstName')
        this.prisonerLastName = page.locator('#lastName')
        this.prisonerNumber = page.locator('#prisonNumber')
        this.firstNameError = page.locator('#firstName-error')
        this.secondNameError = page.locator('#lastName-error')
        this.dobError = page.locator('#prisonerDob-error')
        this.noPrisonerNumError = page.locator('#prisonNumber-error')
        this.dobDay = page.locator('#prisonerDob-day')
        this.dobMonth = page.locator('#prisonerDob-month')
        this.dobYear = page.locator('#prisonerDob-year')
    }
    async getFirstNameErrorMsg(): Promise<string> {
        const noFirstNameErrorMsg = this.firstNameError
        return noFirstNameErrorMsg.innerText()
    }

    async getSecondNameErrorMsg(): Promise<string> {
        const noSecondNameErrorMsg = this.secondNameError
        return noSecondNameErrorMsg.innerText()
    }

    async getDobErrorMsg(): Promise<string> {
        const noDobErrorMsg = this.dobError
        return noDobErrorMsg.innerText()
    }

    async getPrisonNumErrorMsg(): Promise<string> {
        const noPrisonNumMsg = this.noPrisonerNumError
        return noPrisonNumMsg.innerText()
    }

    async enterName(firstName: string, lastName: string): Promise<void> {
        await this.prisonerFirstName.fill(firstName)
        await this.prisonerLastName.fill(lastName)
    }

    async enterDob(day: string, month: string, year: string): Promise<void> {
        await this.dobDay.fill(day)
        await this.dobMonth.fill(month)
        await this.dobYear.fill(year)
    }

    async enterPrisonNum(prisonNum: string): Promise<void> {
        await this.prisonerNumber.fill(prisonNum)
    }

}
