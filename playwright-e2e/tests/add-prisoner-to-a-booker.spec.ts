import { test, expect } from '../fixtures/PageFixtures'
import GlobalData from '../setup/GlobalData'
import { getAccessToken, resetBooker } from '../support/testingHelperClient'
import { UserType } from '../support/UserType'

test.beforeAll('Get access token and store so it is available as global data', async ({ request }, testInfo) => {
    GlobalData.set('authToken', await getAccessToken({ request }))
    GlobalData.set('deviceName', testInfo.project.name)
})

test.describe('Add prisoner to a booker', () => {

    test.beforeEach(async ({ context, loginPage, homePage }) => {
        await context.clearCookies()
        await loginPage.navigateTo('/home')
        await loginPage.checkOnPage('Create your GOV.UK One Login or sign in')
        await loginPage.signInWith(UserType.USER_WITH_NO_PRISONERS)
        expect(await homePage.checkOnPage('Book a visit'))
        await homePage.clickOnAddPrisoner()
        await homePage.selectPrisonFromList('DHI')
        await homePage.continueToNextPage()
    })

    test('Error messages on the page', async ({
        prisonerDetailsPage
    }) => {

        expect(await prisonerDetailsPage.checkOnPage('Prisoner details'))
        await prisonerDetailsPage.clickConfirmAndSend()
        const noFirstNameErr = await prisonerDetailsPage.getFirstNameErrorMsg()
        const noSecondNameErr = await prisonerDetailsPage.getSecondNameErrorMsg()
        const noDobErrorMsg = await prisonerDetailsPage.getDobErrorMsg()
        const noPrisonerNumError = await prisonerDetailsPage.getPrisonNumErrorMsg()
        expect(noFirstNameErr).toContain('Enter a first name')
        expect(noSecondNameErr).toContain('Enter a last name')
        expect(noDobErrorMsg).toContain('Enter a date of birth')
        expect(noPrisonerNumError).toContain('Enter a prison number')
    })

    test('Add a new prisoner', async ({
        prisonerDetailsPage
    }) => {

        expect(await prisonerDetailsPage.checkOnPage('Prisoner details'))
        await prisonerDetailsPage.enterName('Diydonopher', 'Armoline')
        await prisonerDetailsPage.enterDob('04', '11', '1979')
        await prisonerDetailsPage.enterPrisonNum('G2484UX')
        await prisonerDetailsPage.clickConfirmAndSend()
        await prisonerDetailsPage.checkOnPage('Prisoner added')
    })

    test.afterAll('Teardown test data', async ({ request }) => {
        const bookerEmail = 'prisonvisitsbooking+autotest5@digital.justice.gov.uk'
        await resetBooker({ request }, bookerEmail)
    })

})
